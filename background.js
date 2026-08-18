// VR Mobile Side - Background Service Worker (Manifest V3)

/** @type {Set<number>} */
const vrPendingTabs = new Set();

chrome.runtime.onInstalled.addListener(() => {
  // Create context menu for quick toggle
  chrome.contextMenus.create({
    id: "vr-mobile-side-toggle",
    title: "Buka Tab Baru (VR SBS Cinema)",
    contexts: ["page", "video"]
  });

  // Set default settings if not exists
  chrome.storage.local.get("vrSettings", (result) => {
    if (!result.vrSettings) {
      const defaultSettings = {
        enabled: false,
        mode: "fullweb",     // "fullweb" | "media"
        openInNewTab: true,  // Auto open new tab on enter VR
        zoom: 1.0,           // 0.5 to 1.5
        ipd: 0,              // -50 to 50 px
        brightness: 100,     // 10% to 100%
        curved: false,       // true / false
        curveIntensity: 15,  // deg
        aspectRatio: "16/9", // "auto", "16/9", "21/9", "4/3"
        gyroEnabled: false,  // true / false
        gyroType: "immersive_360",
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
    handleVREnterOrToggle(tab);
  }
});

// Handle keyboard command (Alt+V)
chrome.commands.onCommand.addListener((command) => {
  if (command === "toggle-vr-sbs") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        handleVREnterOrToggle(tabs[0]);
      }
    });
  }
});

// Handle message requests from popup or content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "VR_OPEN_NEW_TAB" && request.url) {
    openInNewVRTab(request.url, request.index, request.mode);
    sendResponse({ success: true });
    return true;
  }
});

// Auto-trigger VR when pending new tab completes loading
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && vrPendingTabs.has(tabId)) {
    vrPendingTabs.delete(tabId);
    setTimeout(() => {
      triggerVROnTab(tabId, true);
    }, 250);
  }
});

/**
 * Open a URL in a new active tab and trigger VR mode automatically
 * @param {string} url
 * @param {number} [index]
 * @param {string} [mode]
 */
function openInNewVRTab(url, index, mode) {
  let targetUrl = url;
  if (targetUrl.startsWith("http://") || targetUrl.startsWith("https://")) {
    if (!targetUrl.includes("#vr-sbs-mode")) {
      targetUrl += (targetUrl.includes("#") ? "-vr-sbs-mode" : "#vr-sbs-mode");
    }
  }

  chrome.tabs.create({
    url: targetUrl,
    index: typeof index === "number" ? index + 1 : undefined,
    active: true
  }, (newTab) => {
    if (newTab && newTab.id) {
      vrPendingTabs.add(newTab.id);
    }
  });
}

/**
 * Handle entering VR in a new tab, or toggling off if already in VR
 * @param {chrome.tabs.Tab} tab
 */
function handleVREnterOrToggle(tab) {
  if (!tab.id || !tab.url) return;

  chrome.tabs.sendMessage(tab.id, { action: "VR_GET_STATUS" }, (response) => {
    if (chrome.runtime.lastError || !response || !response.state || !response.state.enabled) {
      // Not in VR currently -> Open in a new tab with VR mode
      chrome.storage.local.get("vrSettings", (res) => {
        const settings = res.vrSettings || {};
        if (settings.openInNewTab !== false) {
          openInNewVRTab(tab.url || "", tab.index, settings.mode);
        } else {
          triggerVROnTab(tab.id || 0, false);
        }
      });
    } else {
      // Already in VR on this tab -> Toggle off
      triggerVROnTab(tab.id, false);
    }
  });
}

/**
 * Send VR_TOGGLE command to tab with auto-injection fallback
 * @param {number} tabId
 * @param {boolean} [forceEnable]
 */
function triggerVROnTab(tabId, forceEnable) {
  chrome.tabs.sendMessage(tabId, { action: "VR_TOGGLE", forceEnable: !!forceEnable }, (response) => {
    if (chrome.runtime.lastError) {
      // Content script might not be injected yet, inject it manually
      chrome.scripting.executeScript({
        target: { tabId: tabId, allFrames: true },
        files: ["content.js"]
      }).then(() => {
        setTimeout(() => {
          chrome.tabs.sendMessage(tabId, { action: "VR_TOGGLE", forceEnable: !!forceEnable });
        }, 150);
      }).catch(err => {
        console.warn("Could not inject VR Mobile Side script:", err);
      });
    }
  });
}
