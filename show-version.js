(async function showVersion({ $versionEl, $toggleEl }) {
  $toggleEl.addEventListener('click', () => {
    $versionEl.hidden = !$versionEl.hidden;
  });

  try {
    const res = await fetch('./version.json', { cache: 'no-store' });
    if (!res.ok) return;
    const versionData = await res.json();
    if ($versionEl)
      $versionEl.textContent = `
    🪾${versionData.version}
    🕰️${new Date(versionData.timestamp).toLocaleString()}`;
  } catch (e) {
    console.warn(e);
  }
})({ $versionEl: $buildInfo, $toggleEl: $footerCopyright });
