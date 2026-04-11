import { getAllFeedback } from "./endpoints/get-feedback.js";
import { getUserData } from "./endpoints/user-data.js";
import { deleteFeedback } from "./endpoints/delete-feedback.js";
import { stringToHash } from "./helpers/hash-string.js";
import { getHashParameter } from "./helpers/hash-param.js";

// Admin code hash — not stored in plaintext
const ADMIN_CODE_HASH = 863976026;

const $feedbackList = document.getElementById("$feedbackList");

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function renderFeedbackItem(
  {
    message,
    subject,
    email,
    displayName,
    reaction,
    createdAt,
    _userId,
    userName,
    id,
  },
  isAdmin,
) {
  const $item = document.createElement("div");
  $item.className = "feedback-item flex-col gap-1";

  if (subject) {
    const $subject = document.createElement("div");
    $subject.className = "feedback-subject";
    $subject.textContent = subject;
    $item.appendChild($subject);
  }

  const $message = document.createElement("div");
  $message.className = "feedback-message";
  $message.textContent = message || "";
  $item.appendChild($message);

  const $meta = document.createElement("div");
  $meta.className = "feedback-meta";

  const nameDisplay = displayName || userName || _userId || "anon";
  const dateStr = createdAt
    ? new Date(createdAt.seconds * 1000).toLocaleString()
    : "-";

  const parts = [nameDisplay];
  if (email) parts.push(email);
  if (reaction) parts.push(reaction);
  parts.push(dateStr);

  $meta.textContent = parts.join(" · ");

  $item.appendChild($meta);

  if (isAdmin) {
    const $btnDelete = document.createElement("button");
    $btnDelete.className = "delete-feedback-btn";
    $btnDelete.textContent = "🗑️";
    $btnDelete.addEventListener("click", async () => {
      if (!confirm("Delete this feedback?")) return;
      try {
        await deleteFeedback(id);
        $item.remove();
      } catch (err) {
        alert("Failed to delete: " + err.message);
      }
    });
    $meta.appendChild($btnDelete);
  }

  return $item;
}

// Admin mode via hash param ?admin or prompt
let isAdmin = false;

function checkAdminAccess() {
  const adminParam = getHashParameter("admin");
  if (adminParam !== null && adminParam !== undefined) {
    // URL has #admin=<code>
    if (stringToHash(adminParam) === ADMIN_CODE_HASH) {
      return true;
    }
  }
  return false;
}

function askForDeleteAccess() {
  const code = prompt("Enter admin code:");
  if (code === null) return;
  if (stringToHash(code) === ADMIN_CODE_HASH) {
    isAdmin = true;
    loadFeedback();
  } else {
    alert("Wrong code");
  }
}

async function loadFeedback() {
  $feedbackList.innerHTML = "Loading...";
  try {
    const feedbacks = await getAllFeedback();
    if (!feedbacks.length) {
      $feedbackList.innerHTML = "<i>No feedback yet.</i>";
      return;
    }
    // Fetch user names in parallel
    const userIdSet = new Set(
      feedbacks.map((fb) => fb._userId).filter(Boolean),
    );
    const userIdToName = {};
    await Promise.all(
      Array.from(userIdSet).map(async (userId) => {
        const userData = await getUserData(userId);
        userIdToName[userId] = userData?.name || userData?.displayName || null;
      }),
    );
    $feedbackList.innerHTML = "";
    feedbacks.forEach((fb) => {
      $feedbackList.appendChild(
        renderFeedbackItem(
          { ...fb, userName: userIdToName[fb._userId] },
          isAdmin,
        ),
      );
    });
  } catch (e) {
    $feedbackList.innerHTML = `<span style='color:red'>Failed to load feedback: ${e.message}</span>`;
  }
}

// Check admin access from URL hash
isAdmin = checkAdminAccess();

// Admin button (only visible when not already admin)
if (!isAdmin) {
  const $btnAdmin = document.createElement("button");
  $btnAdmin.textContent = "🔒";
  $btnAdmin.className = "admin-toggle-btn";
  $btnAdmin.addEventListener("click", askForDeleteAccess);
  document.body.appendChild($btnAdmin);
}

loadFeedback();
