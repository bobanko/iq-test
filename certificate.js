// ===== html2pdf library (loaded lazily) =====
let html2pdfReady = null;

function loadHtml2Pdf() {
  if (html2pdfReady) return html2pdfReady;

  html2pdfReady = new Promise((resolve, reject) => {
    if (window.html2pdf) {
      resolve(window.html2pdf);
      return;
    }

    const $script = document.createElement("script");
    $script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
    $script.async = true;
    $script.onload = () => resolve(window.html2pdf);
    $script.onerror = () => reject(new Error("html2pdf failed to load"));
    document.head.append($script);
  });

  return html2pdfReady;
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

// ===== Certificate PDF Generation (HTML -> PDF) =====
export async function generateCertificatePdf(certificateData) {
  if (!certificateData) {
    alert("Result data is not ready yet.");
    return;
  }

  let html2pdf;
  try {
    html2pdf = await loadHtml2Pdf();
  } catch {
    alert("PDF library failed to load. Please try again.");
    return;
  }

  const playerName = certificateData.playerName || "Anonymous player";
  const safeDate = String(certificateData.dateTaken || "date").replaceAll(
    "/",
    "-",
  );

  const pageWidthPx = 1122;
  const pageHeightPx = 793;

  const $container = document.createElement("div");
  $container.style.position = "fixed";
  $container.style.left = "0";
  $container.style.top = "0";
  $container.style.width = `${pageWidthPx}px`;
  $container.style.height = `${pageHeightPx}px`;
  $container.style.zIndex = "-1";
  $container.style.overflow = "hidden";
  $container.style.opacity = "0";
  $container.style.pointerEvents = "none";

  $container.innerHTML = `
    <section style="
      width: ${pageWidthPx}px;
      height: ${pageHeightPx}px;
      box-sizing: border-box;
      margin: 0;
      border: 0;
      border-radius: 0;
      box-shadow: none;
      padding: 36px;
      font-family: 'Segoe UI', 'Trebuchet MS', Arial, sans-serif;
      background: linear-gradient(130deg, #0f1022 0%, #172147 35%, #274a95 100%);
      color: #f6f7ff;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      gap: 16px;
    ">
      <div style="
        position: absolute;
        width: 400px;
        height: 400px;
        border-radius: 50%;
        background: radial-gradient(circle, #6c6cff80 0%, #6c6cff00 68%);
        top: -170px;
        right: -120px;
        filter: blur(1px);
      "></div>

      <div style="
        position: absolute;
        width: 320px;
        height: 320px;
        border-radius: 50%;
        background: radial-gradient(circle, #00d1b25c 0%, #00d1b200 68%);
        bottom: -160px;
        left: -60px;
      "></div>

      <div style="
        position: absolute;
        inset: 18px;
        border: 1px solid #ffffff30;
        border-radius: 0px;
        pointer-events: none;
      "></div>

      <div style="
        position: relative;
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
      ">
        <div style="display: flex; flex-direction: column; gap: 6px;">
          <div style="
            font-size: 12px;
            letter-spacing: 2px;
            text-transform: uppercase;
            color: #cfd8ff;
          ">420IQ.LOL CERTIFICATE</div>
          <h1 style="
            margin: 10px 0;
            font-size: 44px;
            line-height: 1;
            letter-spacing: -0.7px;
            color: #ffffff;
            font-family: 'Caveat Adjusted', 'Gloria Hallelujah', cursive;
          ">Brain Flex Certificate</h1>
          <p style="margin: 0; font-size: 15px; color: #d0dafb;">
            Verified result from your latest IQ run.
          </p>
        </div>

        <div style="
          width: 164px;
          height: 164px;
          border-radius: 50%;
          background: linear-gradient(150deg, #38ffe4 0%, #35a4ff 52%, #8b7cff 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffff;
          font-weight: 900;
          font-size: 56px;
          box-shadow: 0 14px 30px #0000004d;
        ">
          ${escapeHtml(certificateData.iq)}
        </div>
      </div>

      <div style="
        position: relative;
        z-index: 1;
        margin-top: 6px;
        background: #ffffff12;
        border: 1px solid #ffffff26;
        border-radius: 18px;
        padding: 20px 22px;
        display: grid;
        grid-template-columns: 1.1fr 1fr;
        gap: 18px;
      ">
        <div style="display: flex; flex-direction: column; justify-content: space-between; gap: 10px;">
          <div style="font-size: 13px; text-transform: uppercase; letter-spacing: 1.4px; color: #b6c4ff;">
            This certifies that
          </div>
          <div style="
            font-size: 40px;
            font-weight: 800;
            line-height: 1.05;
            letter-spacing: -0.5px;
            word-break: break-word;
            text-shadow: 0 2px 16px #00000040;
            font-family: 'Gloria Hallelujah', 'Caveat Adjusted', cursive;
          ">${escapeHtml(playerName)}</div>
          <div style="font-size: 17px; color: #d9e1ff;">
            reached <b>${escapeHtml(certificateData.percentileLabel)}</b> and earned rank <b>${escapeHtml(certificateData.globalRank)}</b>.
          </div>
          <div style="
            align-self: flex-start;
            padding: 10px 14px;
            border-radius: 999px;
            background: linear-gradient(90deg, #3ee6cf 0%, #5ac5ff 100%);
            color: #112247;
            font-size: 13px;
            font-weight: 800;
            letter-spacing: 0.6px;
            text-transform: uppercase;
          ">${escapeHtml(certificateData.cognitiveSubgroup)}</div>
        </div>

        <div style="
          display: grid;
          grid-template-columns: 1fr;
          gap: 10px;
        ">
          <div style="padding: 10px 12px; border-radius: 12px; background: #ffffff0d; border: 1px solid #ffffff22;">
            <div style="font-size: 11px; color: #afbeff; text-transform: uppercase; letter-spacing: 1px;">Date</div>
            <div style="font-size: 19px; font-weight: 700;">${escapeHtml(certificateData.dateTaken)}</div>
          </div>
          <div style="padding: 10px 12px; border-radius: 12px; background: #ffffff0d; border: 1px solid #ffffff22;">
            <div style="font-size: 11px; color: #afbeff; text-transform: uppercase; letter-spacing: 1px;">Correct answers</div>
            <div style="font-size: 19px; font-weight: 700;">${escapeHtml(certificateData.correctAnswers)}</div>
          </div>
          <div style="padding: 10px 12px; border-radius: 12px; background: #ffffff0d; border: 1px solid #ffffff22;">
            <div style="font-size: 11px; color: #afbeff; text-transform: uppercase; letter-spacing: 1px;">Completion time</div>
            <div style="font-size: 19px; font-weight: 700;">${escapeHtml(certificateData.completionTime)}</div>
          </div>
          <div style="padding: 10px 12px; border-radius: 12px; background: #ffffff0d; border: 1px solid #ffffff22;">
            <div style="font-size: 11px; color: #afbeff; text-transform: uppercase; letter-spacing: 1px;">Average speed</div>
            <div style="font-size: 19px; font-weight: 700;">${escapeHtml(certificateData.answerSpeed)}</div>
          </div>
        </div>
      </div>

      <div style="
        position: relative;
        z-index: 1;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: auto;
        gap: 20px;
      ">
        <div style="display: flex; flex-direction: column; gap: 8px; color: #d5ddff; font-size: 12px;">
          <div style="width: 260px; border-bottom: 1px solid #c9d6ff6e;"></div>
          <div style="font-family: 'Caveat Adjusted', 'Gloria Hallelujah', cursive; font-size: 18px;">Issued by iq-test</div>
        </div>

        <div style="
          font-size: 11px;
          color: #b3c2fb;
          letter-spacing: 1px;
          text-transform: uppercase;
        ">Keep training your brain</div>

        <div style="text-align: right; display: flex; align-items: center; gap: 10px;">
          <div style="
            font-size: 12px;
            color: #d5deff;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-family: 'Gloria Hallelujah', 'Caveat Adjusted', cursive;
          ">Verified</div>
          <div style="
            width: 86px;
            height: 86px;
            border-radius: 50%;
            border: 2px solid #7bd5ff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            color: #96e7ff;
            line-height: 1.2;
            font-size: 14px;
            background: #1b2f66;
            font-family: 'Caveat Adjusted', 'Gloria Hallelujah', cursive;
          ">
            IQ CERT
          </div>
        </div>
      </div>
    </section>
  `;

  document.body.append($container);

  const options = {
    margin: 0,
    filename: `iq-certificate-${safeDate}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      backgroundColor: "#0f1022",
      windowWidth: pageWidthPx,
      windowHeight: pageHeightPx,
      scrollX: 0,
      scrollY: 0,
      x: 0,
      y: 0,
    },
    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "landscape",
    },
  };

  try {
    await html2pdf().set(options).from($container.firstElementChild).save();
  } finally {
    $container.remove();
  }
}
