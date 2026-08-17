// VR Mobile Side - Background Service Worker (Manifest V3)

chrome.runtime.onInstalled.addListener(() => {
  // Create context menu for quick toggle
  chrome.contextMenus.create({
    id: "vr-mobile-side-toggle",
    title: "Toggle VR Mobile Side (SBS Cinema)",
    contexts: ["page", "video"]
  });

  // Set default settings if not exists
  chrome.storage.local.get("vrSettings", (result) => {
    if (!result.vrSettings) {
      const defaultSettings = {
        enabled: false,
        zoom: 1.0,           // 0.5 to 1.5
        ipd: 0,              // -50 to 50 px
        brightness: 100,     // 10% to 100%
        curved: false,       // true / false
        curveIntensity: 15,  // deg
        aspectRatio: "16/9", // "auto", "16/9", "21/9", "4/3"
        gyroEnabled: false,  // true / false
        gyroSensitivity: 1.0,
        opticalDividerWidth: 4 // px
      };
      chrome.storage.local.set({ vrSettings: defaultSettings });
    }
  });
});

// Handle context menu click
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "vr-mobile-side-toggle" && tab?.id) {
    sendToggleToTab(tab.id);
  }
});

// Handle keyboard command
chrome.commands.onCommand.addListener((command) => {
  if (command === "toggle-vr-sbs") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        sendToggleToTab(tabs[0].id);
      }
    });
  }
});

function sendToggleToTab(tabId) {
  chrome.tabs.sendMessage(tabId, { action: "VR_TOGGLE" }, (response) => {
    if (chrome.runtime.lastError) {
      // Content script might not be injected yet, inject it manually
      chrome.scripting.executeScript({
        target: { tabId: tabId, allFrames: true },
        files: ["content.js"]
      }).then(() => {
        setTimeout(() => {
          chrome.tabs.sendMessage(tabId, { action: "VR_TOGGLE" });
        }, 100);
      }).catch(err => {
        console.warn("Could not inject VR Mobile Side script:", err);
      });
    }
  });
}
