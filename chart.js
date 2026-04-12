function getPairs(array) {
  return Array.from({ length: array.length - 1 }, (_, i) => [
    array[i],
    array[i + 1],
  ]);
}

function groupBySplitPoints({ numbers, splitPoints }) {
  const sortedNumbers = numbers.toSorted((a, b) => a - b);
  const sortedSplitPoints = [-Infinity, ...splitPoints, Infinity].toSorted(
    (a, b) => a - b,
  );

  const resultGroups = [];

  let numberIndex = 0;
  for (const [min, max] of getPairs(sortedSplitPoints)) {
    const group = {
      min,
      max,
      items: [],
      name: getGroupRangeName({ min, max }),
    };

    while (
      sortedNumbers[numberIndex] < max - 1 &&
      numberIndex < numbers.length
    ) {
      group.items.push(sortedNumbers[numberIndex]);
      numberIndex++;
    }
    resultGroups.push(group);
  }

  return resultGroups;
}

function getGroupRangeName({ min, max }) {
  if (min === -Infinity) return `<${max}`;
  if (max === Infinity) return `${min}+`;

  return `${min}`;
}

export function initChart({ chartData, highlightValue = null }) {
  // todo(vmyshko): dynamically create chart as well
  const min = Math.min(...chartData);
  const max = Math.max(...chartData);

  console.log("🧠", chartData, min, max);

  const groups = groupBySplitPoints({
    numbers: chartData,
    splitPoints: [65, 70, 80, 90, 100, 110, 120, 130, 135],
  });

  console.log("🍆", groups);

  const maxLinesY = 6;

  //
  const maxCount = Math.max(...groups.map(({ items }) => items.length));
  const chartYstep = Math.floor((maxCount - 1) / maxLinesY) + 1;

  const linesCount = Math.ceil(maxCount / chartYstep) + 1;

  // const maxY = maxCount + (maxCount % chartYstep);
  const maxY = Math.ceil(maxCount / chartYstep) * chartYstep;
  console.log(linesCount, maxY);

  const bellCenterIndex = (groups.length - 1) / 2;
  const bellSigmaIndex = Math.max(groups.length / 5, 1);

  const gaussianValues = groups.map((_, index) => {
    const z = (index - bellCenterIndex) / bellSigmaIndex;

    return Math.exp(-0.5 * z * z);
  });
  const gaussianPeak = Math.max(...gaussianValues, 1);

  const $bars = $chartMain.querySelector(".bars");
  const $lines = $chartMain.querySelector(".lines");
  const $xLabels = $chartMain.querySelector(".x-labels");
  const $curveArea = $chartMain.querySelector(".curve-area");

  $bars.replaceChildren();
  $lines.replaceChildren();
  $xLabels?.replaceChildren();

  groups.forEach(({ name, min, max, items }, index) => {
    const $bar = $tmplChartBar.content.firstElementChild.cloneNode(true);
    const $xLabel = document.createElement("div");

    const groupTitle = getGroupRangeName({ min, max });
    const count = items.length;
    const gaussianRatio = gaussianValues[index] / gaussianPeak;
    const gaussianCount = gaussianRatio * maxY;

    // TEMP: stub heights with normal distribution shape.
    const countPt = ((gaussianCount / maxY) * 100).toFixed(2);

    // Original logic (real histogram counts):
    // const countPt = ((count / maxY) * 100).toFixed(2);

    // todo(vmyshko): debug
    // $bar.title = items.sort();

    // TEMP: keep all bars uniform, without highlighted bucket.
    const isActive =
      Number.isFinite(highlightValue) &&
      highlightValue >= min &&
      highlightValue <= max - 1;

    if (isActive) {
      $bar.classList.add("active");

      const $label = document.createElement("div");
      $label.className = "bar-label";
      $label.textContent = `You: ${highlightValue}`;
      $bar.prepend($label);
    }

    $bar.style.setProperty("--value", `${countPt}%`);

    $bar.querySelector(".value").textContent = `${groupTitle}`; // [${count}]
    $xLabel.className = "x-label";
    $xLabel.textContent = `${groupTitle}`;

    $bars.appendChild($bar);
    $xLabels?.appendChild($xLabel);
  });

  Array(linesCount)
    .fill(0)
    .map((_, i) => i * chartYstep)
    .reverse() // todo(vmyshko): do it with css?
    .forEach((value) => {
      const $line = $tmplChartLine.content.firstElementChild.cloneNode(true);

      //   $line.style.setProperty("--value", value);
      $line.querySelector(".value").textContent = `${value}`;

      $lines.appendChild($line);
    });

  if ($curveArea) {
    const sampleCount = 72;
    const points = Array.from({ length: sampleCount + 1 }, (_, i) => {
      const x = (i / sampleCount) * 100;
      const idx = groups.length > 1 ? (x / 100) * (groups.length - 1) : 0;
      const z = (idx - bellCenterIndex) / bellSigmaIndex;
      const value = Math.exp(-0.5 * z * z);
      const ratio = value / gaussianPeak;
      let y = 100 - ratio * 100;

      if (i === 0 || i === sampleCount) {
        y = 100;
      }

      return { x, y };
    });

    const areaTopD = points
      .map(
        ({ x, y }, i) =>
          `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`,
      )
      .join(" ");

    const areaD = `${areaTopD} L 100 100 L 0 100 Z`;

    $curveArea.setAttribute("d", areaD);
  }
}
