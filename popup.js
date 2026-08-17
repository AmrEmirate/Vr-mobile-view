// VR Mobile Side - Popup Script v1.4.5

document.addEventListener("DOMContentLoaded", () => {
  const btnToggleVR = /** @type {HTMLElement} */ (document.getElementById("btn-toggle-vr"));
  const btnToggleText = /** @type {HTMLElement} */ (document.getElementById("btn-toggle-text"));
  const statusBadge = /** @type {HTMLElement} */ (document.getElementById("status-badge"));
  const statusText = /** @type {HTMLElement} */ (document.getElementById("status-text"));

  const btnModeFullweb = document.getElementById("btn-mode-fullweb");
  const btnModeMedia = document.getElementById("btn-mode-media");

  const sliderZoom = /** @type {HTMLInputElement} */ (document.getElementById("slider-zoom"));
  const dispZoom = /** @type {HTMLElement} */ (document.getElementById("disp-zoom"));

  const sliderIpd = /** @type {HTMLInputElement} */ (document.getElementById("slider-ipd"));
  const dispIpd = /** @type {HTMLElement} */ (document.getElementById("disp-ipd"));

  const sliderBrightness = /** @type {HTMLInputElement} */ (document.getElementById("slider-brightness"));
  const dispBrightness = /** @type {HTMLElement} */ (document.getElementById("disp-brightness"));

  const checkCurved = /** @type {HTMLInputElement} */ (document.getElementById("check-curved"));
  const checkGyro = /** @type {HTMLInputElement} */ (document.getElementById("check-gyro"));

  const aspectChips = document.querySelectorAll(".aspect-chips .chip");
  const presetBtns = document.querySelectorAll(".btn-preset");
  const btnReset = /** @type {HTMLElement} */ (document.getElementById("btn-reset"));

  let currentSettings = {
    enabled: false,
    mode: "fullweb",
    zoom: 1.0,
    ipd: 0,
    brightness: 100,
    curved: false,
    aspectRatio: "16/9",
    gyroEnabled: false,
    gyroType: "immersive_360",
    gyroSensitivity: 1.0
  };

  // Get active tab and fetch status
  function fetchActiveTabStatus() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs || !tabs[0] || !tabs[0].id) return;
      const tabId = tabs[0].id;

      chrome.tabs.sendMessage(tabId, { action: "VR_GET_STATUS" }, (response) => {
        if (chrome.runtime.lastError || !response) {
          loadFromStorage();
        } else if (response.state) {
          Object.assign(currentSettings, response.state);
          updateUI();
        }
      });
    });
  }

  function loadFromStorage() {
    chrome.storage.local.get("vrSettings", (result) => {
      if (result && result.vrSettings) {
        Object.assign(currentSettings, result.vrSettings);
        updateUI();
      }
    });
  }

  function updateUI() {
    // Status Badge & Main Button
    if (currentSettings.enabled) {
      statusBadge.classList.add("active");
      statusText.textContent = "AKTIF (SBS)";
      btnToggleVR.classList.add("active");
      btnToggleText.textContent = "Keluar dari Mode VR";
    } else {
      statusBadge.classList.remove("active");
      statusText.textContent = "OFF";
      btnToggleVR.classList.remove("active");
      btnToggleText.textContent = "Masuk Mode VR (SBS)";
    }

    // Mode Selector
    if (btnModeFullweb && btnModeMedia) {
      btnModeFullweb.classList.toggle("active", currentSettings.mode !== "media");
      btnModeMedia.classList.toggle("active", currentSettings.mode === "media");
    }

    // Sliders
    if (sliderZoom && dispZoom) {
      sliderZoom.value = String(Math.round(currentSettings.zoom * 100));
      dispZoom.textContent = `${Math.round(currentSettings.zoom * 100)}%`;
    }

    if (sliderIpd && dispIpd) {
      sliderIpd.value = String(currentSettings.ipd);
      dispIpd.textContent = `${currentSettings.ipd > 0 ? "+" : ""}${currentSettings.ipd} px`;
    }

    if (sliderBrightness && dispBrightness) {
      sliderBrightness.value = String(currentSettings.brightness);
      dispBrightness.textContent = `${currentSettings.brightness}%`;
    }

    // Checkboxes & Gyro
    if (checkCurved) checkCurved.checked = !!currentSettings.curved;
    if (checkGyro) checkGyro.checked = !!currentSettings.gyroEnabled;

    const groupGyroType = document.getElementById("group-gyro-type");
    const groupGyroSens = document.getElementById("group-gyro-sens");
    const sliderGyroSens = /** @type {HTMLInputElement|null} */ (document.getElementById("slider-gyro-sens"));
    const dispGyroSens = document.getElementById("disp-gyro-sens");
    const gyroChipsList = document.querySelectorAll("#gyro-chips .chip");

    if (groupGyroType && groupGyroSens && sliderGyroSens && dispGyroSens) {
      groupGyroType.style.display = currentSettings.gyroEnabled ? "block" : "none";
      groupGyroSens.style.display = currentSettings.gyroEnabled ? "block" : "none";
      const sens = currentSettings.gyroSensitivity || 1.0;
      sliderGyroSens.value = String(Math.round(sens * 10));
      dispGyroSens.textContent = `${sens.toFixed(1)}x`;

      const currentType = currentSettings.gyroType || "immersive_360";
      gyroChipsList.forEach((chip) => {
        chip.classList.toggle("active", chip.getAttribute("data-gyro") === currentType);
      });
    }

    // Aspect Ratio Chips
    aspectChips.forEach((chip) => {
      chip.classList.toggle("active", chip.getAttribute("data-aspect") === currentSettings.aspectRatio);
    });
  }

  function pushSettingsToTab() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs || !tabs[0] || !tabs[0].id) return;
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "VR_UPDATE_SETTINGS",
        settings: currentSettings
      });
    });
    chrome.storage.local.set({ vrSettings: currentSettings });
  }

  // Event: Mode Selection
  if (btnModeFullweb) {
    btnModeFullweb.addEventListener("click", () => {
      currentSettings.mode = "fullweb";
      updateUI();
      pushSettingsToTab();
    });
  }
  if (btnModeMedia) {
    btnModeMedia.addEventListener("click", () => {
      currentSettings.mode = "media";
      updateUI();
      pushSettingsToTab();
    });
  }

  // Event: Main Toggle Button
  if (btnToggleVR) {
    btnToggleVR.addEventListener("click", () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs || !tabs[0] || !tabs[0].id) return;
        const tabId = tabs[0].id;

        chrome.tabs.sendMessage(tabId, { action: "VR_TOGGLE" }, (res) => {
          if (chrome.runtime.lastError) {
            chrome.scripting.executeScript({
              target: { tabId: tabId, allFrames: true },
              files: ["content.js"]
            }).then(() => {
              setTimeout(() => {
                chrome.tabs.sendMessage(tabId, { action: "VR_TOGGLE" }, (r) => {
                  if (r && typeof r.enabled !== "undefined") {
                    currentSettings.enabled = r.enabled;
                    updateUI();
                    chrome.storage.local.set({ vrSettings: currentSettings });
                  }
                });
              }, 120);
            }).catch(console.warn);
          } else if (res) {
            currentSettings.enabled = res.enabled;
            updateUI();
            chrome.storage.local.set({ vrSettings: currentSettings });
          }
        });
      });
    });
  }

  // Event: Zoom Slider
  if (sliderZoom && dispZoom) {
    sliderZoom.addEventListener("input", (e) => {
      const target = /** @type {HTMLInputElement} */ (e.target);
      const val = parseInt(target.value, 10);
      currentSettings.zoom = parseFloat((val / 100).toFixed(2));
      dispZoom.textContent = `${val}%`;
      pushSettingsToTab();
    });
  }

  // Event: IPD Slider
  if (sliderIpd && dispIpd) {
    sliderIpd.addEventListener("input", (e) => {
      const target = /** @type {HTMLInputElement} */ (e.target);
      const val = parseInt(target.value, 10);
      currentSettings.ipd = val;
      dispIpd.textContent = `${val > 0 ? "+" : ""}${val} px`;
      pushSettingsToTab();
    });
  }

  // Event: Brightness Slider
  if (sliderBrightness && dispBrightness) {
    sliderBrightness.addEventListener("input", (e) => {
      const target = /** @type {HTMLInputElement} */ (e.target);
      const val = parseInt(target.value, 10);
      currentSettings.brightness = val;
      dispBrightness.textContent = `${val}%`;
      pushSettingsToTab();
    });
  }

  // Event: Curved Checkbox
  if (checkCurved) {
    checkCurved.addEventListener("change", (e) => {
      const target = /** @type {HTMLInputElement} */ (e.target);
      currentSettings.curved = target.checked;
      pushSettingsToTab();
    });
  }

  // Event: Gyro Checkbox
  if (checkGyro) {
    checkGyro.addEventListener("change", (e) => {
      const target = /** @type {HTMLInputElement} */ (e.target);
      currentSettings.gyroEnabled = target.checked;
      updateUI();
      pushSettingsToTab();
    });
  }

  // Event: Gyro Type Chips
  const gyroChips = document.querySelectorAll("#gyro-chips .chip");
  gyroChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const gType = chip.getAttribute("data-gyro") || "immersive_360";
      currentSettings.gyroType = gType;
      gyroChips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      pushSettingsToTab();
    });
  });

  // Event: Gyro Sensitivity Slider
  const sliderGyroSensEl = /** @type {HTMLInputElement|null} */ (document.getElementById("slider-gyro-sens"));
  if (sliderGyroSensEl) {
    sliderGyroSensEl.addEventListener("input", (e) => {
      const target = /** @type {HTMLInputElement} */ (e.target);
      const val = parseInt(target.value, 10) / 10;
      currentSettings.gyroSensitivity = val;
      const disp = document.getElementById("disp-gyro-sens");
      if (disp) disp.textContent = `${val.toFixed(1)}x`;
      pushSettingsToTab();
    });
  }

  // Event: Aspect Ratio Chips
  aspectChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const aspect = chip.getAttribute("data-aspect") || "16/9";
      currentSettings.aspectRatio = aspect;
      aspectChips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      pushSettingsToTab();
    });
  });

  // Event: Cinema Presets
  presetBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const preset = btn.getAttribute("data-preset");
      presetBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      if (preset === "standard") {
        currentSettings.zoom = 1.0;
        currentSettings.ipd = 0;
        currentSettings.brightness = 100;
        currentSettings.curved = false;
        currentSettings.gyroEnabled = false;
        currentSettings.aspectRatio = "16/9";
      } else if (preset === "imax") {
        currentSettings.zoom = 1.2;
        currentSettings.ipd = 0;
        currentSettings.brightness = 100;
        currentSettings.curved = true;
        currentSettings.gyroEnabled = false;
        currentSettings.aspectRatio = "21/9";
      } else if (preset === "bedtime") {
        currentSettings.zoom = 0.85;
        currentSettings.ipd = 0;
        currentSettings.brightness = 50;
        currentSettings.curved = false;
        currentSettings.gyroEnabled = false;
        currentSettings.aspectRatio = "16/9";
      }

      updateUI();
      pushSettingsToTab();
    });
  });

  // Event: Reset Defaults
  if (btnReset) {
    btnReset.addEventListener("click", () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs && tabs[0] && tabs[0].id) {
          chrome.tabs.sendMessage(tabs[0].id, { action: "VR_RESET" }, (res) => {
            if (res && res.state) {
              Object.assign(currentSettings, res.state);
              updateUI();
            }
          });
        }
      });

      currentSettings = {
        enabled: currentSettings.enabled,
        mode: "fullweb",
        zoom: 1.0,
        ipd: 0,
        brightness: 100,
        curved: false,
        aspectRatio: "16/9",
        gyroEnabled: false,
        gyroType: "immersive_360",
        gyroSensitivity: 1.0
      };
      updateUI();
      pushSettingsToTab();
    });
  }

  fetchActiveTabStatus();
});
