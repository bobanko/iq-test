import {
  collection,
  getDocs,
  query,
  orderBy,
  where,
} from "./endpoints/firebase.js";
import { db } from "./endpoints/firebase.init.js";
import { deleteResult } from "./endpoints/delete-result.js";
import { calcStaticIqByStats } from "./calc-iq.js";
import { emojiFlags, countries } from "./countries.mapping.js";
import { formatTimeSpan } from "./helpers/common.js";
import { stringToHash } from "./helpers/hash-string.js";
import { getHashParameter } from "./helpers/hash-param.js";

// ===== Constants =====

const ADMIN_CODE_HASH = 863976026;

// ===== State =====

let isAdmin = false;
let allResults = [];
let sortColumn = "date";
let sortDirection = "desc";

// ===== Admin Access =====

function checkAdminAccess() {
  const adminParam = getHashParameter("admin");
  if (adminParam !== null && adminParam !== undefined) {
    if (stringToHash(adminParam) === ADMIN_CODE_HASH) return true;
  }
  return false;
}

function askForDeleteAccess() {
  const code = prompt("Enter admin code:");
  if (code === null) return;
  if (stringToHash(code) === ADMIN_CODE_HASH) {
    isAdmin = true;
    $colActions.hidden = false;
    renderResults();
  } else {
    alert("Wrong code");
  }
}

// ===== Data Loading =====

async function loadAllResults() {
  const quizResultsCol = collection(db, "quiz-results");
  const resultsSnapshot = await getDocs(
    query(quizResultsCol, orderBy("datePassed", "desc")),
  );

  const results = resultsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  // fetch user data in batches of 30 (Firestore "in" limit)
  const userIds = [...new Set(results.map((r) => r._userId).filter(Boolean))];
  const usersRef = collection(db, "user-data");
  const users = {};

  for (let i = 0; i < userIds.length; i += 30) {
    const batch = userIds.slice(i, i + 30);
    const usersSnapshot = await getDocs(
      query(usersRef, where("__name__", "in", batch)),
    );
    usersSnapshot.docs.forEach((doc) => {
      users[doc.id] = doc.data();
    });
  }

  return results.map((result) => {
    const user = users[result._userId] || {};
    const iq = calcStaticIqByStats(result.stats || { isCorrect: 0, total: 1 });
    const datePassed = result.datePassed?.toDate?.() || null;

    return {
      id: result.id,
      iq,
      countryCode: user.countryCode || "—",
      displayName: user.displayName || "anon",
      datePassed,
      timeSpent: result.stats?.timeSpent || 0,
      isAnswered: result.stats?.isAnswered ?? 0,
      isCorrect: result.stats?.isCorrect ?? 0,
      total: result.stats?.total ?? 0,
    };
  });
}

// ===== Sorting =====

function sortResults(results, column, direction) {
  const sorted = [...results];
  const dir = direction === "asc" ? 1 : -1;

  sorted.sort((a, b) => {
    switch (column) {
      case "iq":
        return (a.iq - b.iq) * dir;
      case "country":
        return (a.countryCode || "").localeCompare(b.countryCode || "") * dir;
      case "name":
        return (a.displayName || "").localeCompare(b.displayName || "") * dir;
      case "date":
        return (
          ((a.datePassed?.getTime() || 0) - (b.datePassed?.getTime() || 0)) *
          dir
        );
      case "time":
        return (a.timeSpent - b.timeSpent) * dir;
      case "answered":
        return (a.isAnswered - b.isAnswered) * dir;
      case "correct":
        return (a.isCorrect / a.total - b.isCorrect / b.total) * dir;
      default:
        return 0;
    }
  });

  return sorted;
}

function handleSort(column) {
  if (sortColumn === column) {
    sortDirection = sortDirection === "asc" ? "desc" : "asc";
  } else {
    sortColumn = column;
    sortDirection = "desc";
  }
  renderResults();
}

// ===== Rendering =====

function renderResults() {
  const sorted = sortResults(allResults, sortColumn, sortDirection);

  // update sort indicators
  const $$headers = $resultsTable.querySelectorAll("thead th");
  $$headers.forEach(($th) => {
    $th.classList.remove("sort-asc", "sort-desc");
  });
  const columnIndex = [
    "#",
    "iq",
    "country",
    "name",
    "date",
    "time",
    "answered",
    "correct",
    "actions",
  ].indexOf(sortColumn);
  if (columnIndex >= 0) {
    $$headers[columnIndex]?.classList.add(
      sortDirection === "asc" ? "sort-asc" : "sort-desc",
    );
  }

  $resultsBody.innerHTML = "";

  sorted.forEach((result, index) => {
    const $tr = document.createElement("tr");

    // # (row number)
    const $tdIndex = document.createElement("td");
    $tdIndex.textContent = index + 1;
    $tr.appendChild($tdIndex);

    // IQ
    const $tdIq = document.createElement("td");
    $tdIq.className = "col-iq";
    const $iqLink = document.createElement("a");
    $iqLink.className = "result-link";
    $iqLink.href = `./result.html#id=${result.id}`;
    $iqLink.textContent = result.iq;
    $tdIq.appendChild($iqLink);
    $tr.appendChild($tdIq);

    // Country
    const $tdCountry = document.createElement("td");
    $tdCountry.className = "col-country";
    const flag = emojiFlags[result.countryCode];
    $tdCountry.textContent = flag || result.countryCode;
    $tdCountry.title = countries[result.countryCode] || result.countryCode;
    $tr.appendChild($tdCountry);

    // Name
    const $tdName = document.createElement("td");
    $tdName.className = "col-name";
    $tdName.textContent = result.displayName;
    $tdName.title = result.displayName;
    $tr.appendChild($tdName);

    // Date
    const $tdDate = document.createElement("td");
    $tdDate.textContent = result.datePassed
      ? result.datePassed.toLocaleString()
      : "—";
    $tr.appendChild($tdDate);

    // Time spent
    const $tdTime = document.createElement("td");
    $tdTime.textContent = formatTimeSpan(result.timeSpent);
    $tr.appendChild($tdTime);

    // Answered / Total
    const $tdAnswered = document.createElement("td");
    $tdAnswered.className = "col-correct";
    $tdAnswered.textContent = `${result.isAnswered}/${result.total}`;
    $tr.appendChild($tdAnswered);

    // Correct / Total
    const $tdCorrect = document.createElement("td");
    $tdCorrect.className = "col-correct";
    $tdCorrect.textContent = `${result.isCorrect}/${result.total}`;
    $tr.appendChild($tdCorrect);

    // Actions (admin only)
    if (isAdmin) {
      const $tdActions = document.createElement("td");
      $tdActions.className = "col-actions";
      const $btnDelete = document.createElement("button");
      $btnDelete.className = "btn-delete-result";
      $btnDelete.textContent = "🗑️";
      $btnDelete.title = "Delete result";
      $btnDelete.addEventListener("click", async () => {
        if (
          !confirm(
            `Delete result #${index + 1} (IQ ${result.iq}, ${result.displayName})?`,
          )
        )
          return;
        try {
          await deleteResult(result.id);
          allResults = allResults.filter((r) => r.id !== result.id);
          renderResults();
          console.log("🔥 Result deleted:", result.id);
        } catch (err) {
          alert("Failed to delete: " + err.message);
        }
      });
      $tdActions.appendChild($btnDelete);
      $tr.appendChild($tdActions);
    }

    $resultsBody.appendChild($tr);
  });

  $resultsCount.textContent = `Total: ${allResults.length} results`;
}

// ===== Init =====

async function init() {
  // setup sort handlers
  const columns = [
    null,
    "iq",
    "country",
    "name",
    "date",
    "time",
    "answered",
    "correct",
  ];
  const $$headers = $resultsTable.querySelectorAll("thead th");
  $$headers.forEach(($th, i) => {
    if (columns[i]) {
      $th.addEventListener("click", () => handleSort(columns[i]));
    }
  });

  isAdmin = checkAdminAccess();
  if (isAdmin) {
    $colActions.hidden = false;
  } else {
    const $btnAdmin = document.createElement("button");
    $btnAdmin.textContent = "🔒";
    $btnAdmin.className = "admin-toggle-btn";
    $btnAdmin.addEventListener("click", askForDeleteAccess);
    document.body.appendChild($btnAdmin);
  }

  try {
    allResults = await loadAllResults();
    $loadingIndicator.hidden = true;
    renderResults();
  } catch (e) {
    $loadingIndicator.textContent = `Failed to load results: ${e.message}`;
    $loadingIndicator.style.color = "red";
    console.error("🔥 Failed to load results:", e);
  }
}

init();
