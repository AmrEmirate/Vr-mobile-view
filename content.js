// VR Mobile Side - Universal Instant Viewport Duplication Engine v1.1.0
// Universal SBS Duplication for ANY website, iframe video, canvas, or direct media stream

(function () {
  if (window.__VR_MOBILE_SIDE_INITIALIZED__) {
    return;
  }
  window.__VR_MOBILE_SIDE_INITIALIZED__ = true;

  const isTopFrame = window === window.top;

  // Embedded Fallback Stylesheet for 100% CSP Resilience
  const EMBEDDED_FALLBACK_CSS = `
    :host {
      all: initial;
      display: block;
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 2147483647;
      pointer-events: auto;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", sans-serif;
      color: #f1f5f9;
      user-select: none;
      -webkit-user-select: none;
      overflow: hidden;
      background-color: transparent;
      -webkit-tap-highlight-color: transparent;
    }
    .vr-viewport-container {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      background-color: transparent;
      overflow: hidden;
      perspective: 1000px;
      perspective-origin: center center;
    }
    .vr-eye-panel {
      position: relative;
      flex: 1;
      height: 100%;
      width: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      background-color: #000000;
      transform-style: preserve-3d;
      transition: transform 0.05s ease-out;
    }
    .vr-optical-divider {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: var(--vr-divider-width, 4px);
      background-color: #000000;
      box-shadow: 0 0 16px rgba(0, 0, 0, 1), 0 0 32px rgba(0, 0, 0, 1);
      z-index: 100;
      pointer-events: none;
    }
    .vr-screen-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      max-width: 100%;
      max-height: 100%;
      transform-origin: center center;
      transition: transform 0.08s ease-out;
    }
    .vr-media-element {
      display: block;
      max-width: 96%;
      max-height: 94%;
      object-fit: contain;
      border-radius: 6px;
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.9);
      backface-visibility: hidden;
      pointer-events: auto;
    }
    .vr-eye-panel.left-eye {
      pointer-events: auto;
    }
    .vr-eye-panel.left-eye .vr-page-frame,
    .vr-eye-panel.left-eye .vr-media-element {
      pointer-events: auto;
    }
    .vr-eye-panel.right-eye {
      pointer-events: none !important;
      user-select: none !important;
      -webkit-user-select: none !important;
    }
    .vr-eye-panel.right-eye * {
      pointer-events: none !important;
      user-select: none !important;
    }
    .vr-page-frame {
      width: 100%;
      height: 100%;
      border: none;
      background: #000000;
    }
    .aspect-16-9 .vr-media-element { aspect-ratio: 16 / 9; }
    .aspect-21-9 .vr-media-element { aspect-ratio: 21 / 9; }
    .aspect-4-3 .vr-media-element { aspect-ratio: 4 / 3; }
    .aspect-auto .vr-media-element { aspect-ratio: auto; }
    .vr-curved-mode .left-eye .vr-screen-wrapper {
      transform: perspective(900px) rotateY(var(--vr-curve-angle, 10deg)) translateZ(12px);
    }
    .vr-curved-mode .right-eye .vr-screen-wrapper {
      transform: perspective(900px) rotateY(calc(-1 * var(--vr-curve-angle, 10deg))) translateZ(12px);
    }
    .vr-dimmer-layer {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, var(--vr-dimmer-val, 0));
      pointer-events: none;
      z-index: 50;
      transition: background-color 0.15s ease;
    }
    .vr-hud-container {
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 200;
      display: flex;
      flex-direction: column;
      gap: 12px;
      width: calc(100% - 40px);
      max-width: 660px;
      background: rgba(15, 23, 42, 0.88);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 16px;
      padding: 16px 20px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.85), 0 0 20px rgba(2, 132, 199, 0.2);
      transition: opacity 0.25s ease, transform 0.25s ease, visibility 0.25s;
    }
    .vr-hud-container.hud-hidden {
      opacity: 0;
      pointer-events: none;
      transform: translateX(-50%) translateY(30px);
      visibility: hidden;
    }
    .vr-hud-header {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding-bottom: 10px;
    }
    .vr-hud-brand {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .vr-hud-logo {
      width: 22px;
      height: 22px;
      fill: #38bdf8;
    }
    .vr-hud-title {
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.5px;
      color: #f8fafc;
      text-transform: uppercase;
    }
    .vr-hud-badge {
      font-size: 10px;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 999px;
      background: rgba(56, 189, 248, 0.2);
      color: #38bdf8;
      border: 1px solid rgba(56, 189, 248, 0.3);
    }
    .vr-hud-header-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .vr-hud-action-btn {
      background: rgba(30, 41, 59, 0.8);
      color: #cbd5e1;
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 5px 12px;
      border-radius: 8px;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 4px;
      transition: all 0.15s ease;
    }
    .vr-hud-action-btn:hover {
      background: #334155;
      color: #ffffff;
    }
    .vr-hud-close-btn {
      background: rgba(239, 68, 68, 0.15);
      color: #f87171;
      border: 1px solid rgba(239, 68, 68, 0.3);
    }
    .vr-hud-close-btn:hover {
      background: #ef4444;
      color: #ffffff;
    }
    .vr-hud-presets-bar {
      width: 100%;
      display: flex;
      gap: 8px;
    }
    .vr-preset-chip {
      flex: 1;
      background: rgba(30, 41, 59, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      padding: 6px 10px;
      color: #94a3b8;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      text-align: center;
      transition: all 0.15s ease;
    }
    .vr-preset-chip.active {
      background: rgba(2, 132, 199, 0.3);
      border-color: #38bdf8;
      color: #38bdf8;
    }
    .vr-preset-chip:hover {
      background: rgba(2, 132, 199, 0.2);
      color: #f1f5f9;
    }
    .vr-hud-grid {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
      gap: 10px;
    }
    .vr-hud-card {
      background: rgba(30, 41, 59, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 12px;
      padding: 10px 12px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .vr-hud-label {
      font-size: 11px;
      font-weight: 600;
      color: #94a3b8;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .vr-hud-value {
      color: #38bdf8;
      font-size: 11px;
      font-weight: 700;
    }
    .vr-hud-stepper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 6px;
    }
    .vr-btn-step {
      flex: 1;
      height: 32px;
      background: rgba(51, 65, 85, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 6px;
      color: #f1f5f9;
      font-size: 14px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .vr-btn-step:hover {
      background: #0284c7;
      color: #ffffff;
    }
    .vr-btn-step:active {
      transform: scale(0.95);
    }
    .vr-hud-toggle-group {
      display: flex;
      gap: 6px;
      width: 100%;
    }
    .vr-pill-btn {
      flex: 1;
      height: 32px;
      background: rgba(51, 65, 85, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 6px;
      color: #cbd5e1;
      font-size: 11px;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .vr-pill-btn.active {
      background: #0284c7;
      color: #ffffff;
      border-color: #38bdf8;
    }
    .vr-pill-btn:hover {
      background: #475569;
    }
    .vr-pill-btn:active {
      transform: scale(0.95);
    }
    .vr-hud-footer {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 8px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
    }
    .vr-btn-secondary {
      background: rgba(30, 41, 59, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: #94a3b8;
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .vr-btn-secondary:hover {
      background: #334155;
      color: #f1f5f9;
    }
    .vr-hud-hint {
      font-size: 10px;
      color: #64748b;
    }
    .vr-hud-toggle-tab {
      position: absolute;
      top: 16px;
      right: 16px;
      z-index: 210;
      background: rgba(15, 23, 42, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #f8fafc;
      padding: 8px 16px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 600;
      backdrop-filter: blur(12px);
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.6);
      transition: all 0.2s ease;
    }
    .vr-hud-toggle-tab:hover {
      background: #0284c7;
      color: #ffffff;
      border-color: #38bdf8;
      transform: scale(1.04);
    }
    .vr-playback-bar {
      position: absolute;
      top: 16px;
      left: 16px;
      z-index: 210;
      background: rgba(15, 23, 42, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 999px;
      padding: 6px 16px;
      display: flex;
      align-items: center;
      gap: 12px;
      backdrop-filter: blur(12px);
    }
    .vr-play-pause-btn {
      background: none;
      border: none;
      color: #38bdf8;
      font-size: 14px;
      cursor: pointer;
      display: flex;
      align-items: center;
      padding: 0;
    }
    .vr-time-display {
      font-size: 11px;
      font-weight: 600;
      color: #cbd5e1;
      font-variant-numeric: tabular-nums;
    }
    .vr-gaze-reticle {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 24px;
      height: 24px;
      pointer-events: none;
      z-index: 150;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0.8;
      transition: opacity 0.2s, transform 0.15s ease;
    }
    .vr-gaze-dot {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: #38bdf8;
      box-shadow: 0 0 8px #38bdf8;
    }
    .vr-gaze-svg-ring {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      transform: rotate(-90deg);
    }
    .vr-gaze-svg-circle {
      fill: none;
      stroke: #38bdf8;
      stroke-width: 2.5;
      stroke-dasharray: 60;
      stroke-dashoffset: 60;
      transition: stroke-dashoffset 0.05s linear;
    }
    .vr-gaze-reticle.active {
      transform: translate(-50%, -50%) scale(1.35);
      opacity: 1;
    }
    .vr-gaze-dock {
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%) translateY(90px) scale(0.92);
      opacity: 0;
      pointer-events: none;
      z-index: 250;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background: rgba(15, 23, 42, 0.92);
      border: 1px solid rgba(56, 189, 248, 0.35);
      border-radius: 999px;
      padding: 8px 18px;
      box-shadow: 0 16px 45px rgba(0, 0, 0, 0.95), 0 0 24px rgba(2, 132, 199, 0.3);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      transition: opacity 0.32s cubic-bezier(0.16, 1, 0.3, 1), transform 0.32s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .vr-gaze-dock.gaze-visible {
      opacity: 1;
      pointer-events: auto;
      transform: translateX(-50%) translateY(0) scale(1);
    }
    .vr-gaze-btn {
      background: rgba(30, 41, 59, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 999px;
      padding: 7px 14px;
      color: #f1f5f9;
      font-size: 11.5px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 5px;
      white-space: nowrap;
      touch-action: manipulation;
      transition: all 0.15s ease;
    }
    .vr-gaze-btn.gaze-targeted {
      background: #0284c7;
      border-color: #38bdf8;
      color: #ffffff;
      transform: scale(1.08);
      box-shadow: 0 0 14px rgba(56, 189, 248, 0.6);
    }
    .vr-gaze-btn:active {
      transform: scale(0.95);
      background: #0369a1;
    }
    .vr-action-toast {
      position: absolute;
      top: 60px;
      left: 50%;
      transform: translateX(-50%) translateY(-20px);
      z-index: 300;
      background: rgba(15, 23, 42, 0.95);
      border: 1px solid rgba(56, 189, 248, 0.4);
      color: #f8fafc;
      padding: 8px 20px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 700;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8), 0 0 16px rgba(56, 189, 248, 0.25);
      backdrop-filter: blur(16px);
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.25s ease, transform 0.25s ease;
    }
    .vr-action-toast.toast-show {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  `;

  // State
  const state = {
    enabled: false,
    mode: "fullweb",     // "fullweb" (universal whole page duplicate) or "media" (cinema focus)
    zoom: 1.0,           // 0.5 to 1.5
    ipd: 0,              // -50 to +50 px
    brightness: 100,     // 10% to 100%
    curved: false,       // true / false
    curveIntensity: 12,  // deg
    aspectRatio: "16/9", // "auto", "16/9", "21/9", "4/3"
    gyroEnabled: false,  // true / false
    gyroSensitivity: 1.0,
    opticalDividerWidth: 4, // px
    hudVisible: true,
    hudTimeout: null
  };

  // Gyroscope tracking state
  const gyro = {
    initialAlpha: null,
    initialBeta: null,
    currentYaw: 0,
    currentPitch: 0,
    targetYaw: 0,
    targetPitch: 0,
    animFrame: null,
    isListening: false
  };

  let hostEl = null;
  let shadowRoot = null;
  let activeMasterVideo = null;
  let domObserver = null;
  let canvasRenderLoop = null;

  // Load stored settings safely & AUTO-INITIALIZE VR if state.enabled is true (Persist across refresh & link navigation)
  if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
    chrome.storage.local.get("vrSettings", (res) => {
      if (res && res.vrSettings) {
        Object.assign(state, res.vrSettings);
        if (state.enabled) {
          if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", () => {
              if (state.enabled && !hostEl) initVRSystem();
            }, { once: true });
          } else {
            if (state.enabled && !hostEl) initVRSystem();
          }
        }
      }
    });
  }

  // Runtime messaging from background/popup
  if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.onMessage) {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === "VR_TOGGLE") {
        toggleVRMode();
        broadcastToIframes(state.enabled);
        sendResponse({ success: true, enabled: state.enabled, mode: state.mode });
      } else if (request.action === "VR_GET_STATUS") {
        sendResponse({ success: true, state: state });
      } else if (request.action === "VR_UPDATE_SETTINGS") {
        if (request.settings) {
          Object.assign(state, request.settings);
          applyTransforms();
          saveSettings();
        }
        sendResponse({ success: true, state: state });
      } else if (request.action === "VR_RESET") {
        resetToDefaults();
        sendResponse({ success: true, state: state });
      }
      return true;
    });
  }

  // Cross-frame message listener for iframes (Cinema21 embeds & Twin Sync)
  window.addEventListener("message", (event) => {
    if (!event.data) return;

    if (event.data.type === "VR_FRAME_TOGGLE") {
      if (event.data.enabled !== state.enabled) {
        state.enabled = event.data.enabled;
        if (state.enabled) initVRSystem();
        else destroyVRSystem();
      }
      return;
    }

    // Only process VR events if VR mode is currently active
    if (!state.enabled) return;

    if (event.data.type === "VR_REQUEST_FULLSCREEN") {
      if (hostEl) {
        if (hostEl.requestFullscreen) hostEl.requestFullscreen().catch(() => {});
        else if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(() => {});
      }
    } else if (event.data.type === "VR_VIDEO_SYNC_ACTION") {
      // If top window receives action from one eye frame, broadcast to all sister frames
      if (isTopFrame) {
        const allIframes = Array.from(document.querySelectorAll("iframe"));
        if (shadowRoot) {
          const shadowIframes = Array.from(shadowRoot.querySelectorAll("iframe"));
          allIframes.push(...shadowIframes);
        }
        allIframes.forEach((f) => {
          try {
            if (f.contentWindow && f.contentWindow !== event.source) {
              f.contentWindow.postMessage(event.data, "*");
            }
          } catch (e) {}
        });
      }

      // Apply action to all local videos and Shadow DOM videos
      const localVideos = Array.from(document.querySelectorAll("video"));
      if (shadowRoot) {
        localVideos.push(...Array.from(shadowRoot.querySelectorAll("video")));
      }
      localVideos.forEach((v) => {
        if (event.data.action === "play") {
          v.muted = true; // Essential for mobile autoplay permission
          if (typeof event.data.currentTime === "number" && Math.abs(v.currentTime - event.data.currentTime) > 0.3) {
            v.currentTime = event.data.currentTime;
          }
          if (v.paused) v.play().catch(() => {});
        } else if (event.data.action === "pause") {
          if (!v.paused) v.pause();
        } else if (event.data.action === "seek" || event.data.action === "sync_time") {
          if (typeof event.data.currentTime === "number" && Math.abs(v.currentTime - event.data.currentTime) > 0.4) {
            v.currentTime = event.data.currentTime;
          }
        }
      });
    } else if (event.data.type === "VR_INTERACT_SYNC") {
      // Broadcast to sister frames
      if (isTopFrame) {
        const allIframes = Array.from(document.querySelectorAll("iframe"));
        if (shadowRoot) {
          const shadowIframes = Array.from(shadowRoot.querySelectorAll("iframe"));
          allIframes.push(...shadowIframes);
        }
        allIframes.forEach((f) => {
          try {
            if (f.contentWindow && f.contentWindow !== event.source) {
              f.contentWindow.postMessage(event.data, "*");
            }
          } catch (e) {}
        });
      }

      // Execute simulated click/input on target frame
      if (event.data.action === "click") {
        const targetX = event.data.relX * window.innerWidth;
        const targetY = event.data.relY * window.innerHeight;
        let targetEl = document.elementFromPoint(targetX, targetY);

        if (!targetEl && event.data.id) {
          targetEl = document.getElementById(event.data.id);
        }

        if (targetEl) {
          const simulatedClick = new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
            clientX: targetX,
            clientY: targetY,
            view: window
          });
          simulatedClick.__vr_synced__ = true;
          targetEl.dispatchEvent(simulatedClick);

          if (targetEl instanceof HTMLElement && typeof targetEl.click === "function" && targetEl.tagName !== "INPUT" && targetEl.tagName !== "TEXTAREA") {
            targetEl.click();
          }
        }
      } else if (event.data.action === "input") {
        let inputEl = null;
        if (event.data.id) inputEl = document.getElementById(event.data.id);
        if (!inputEl) {
          inputEl = document.elementFromPoint(event.data.relX * window.innerWidth, event.data.relY * window.innerHeight);
        }
        if (inputEl instanceof HTMLInputElement || inputEl instanceof HTMLTextAreaElement) {
          inputEl.value = event.data.value;
          const ev = new Event("input", { bubbles: true });
          ev.__vr_synced__ = true;
          inputEl.dispatchEvent(ev);
        }
      } else if (event.data.action === "scroll") {
        window.scrollTo({ left: event.data.scrollX, top: event.data.scrollY });
      }
    }
  });

  // Attach Interaction Mirroring to Document (Active ONLY in VR mode)
  function attachInteractionSyncToDocument() {
    if (!state.enabled) return;
    if (document.__vr_interaction_sync_attached__) return;
    document.__vr_interaction_sync_attached__ = true;

    // Click Mirroring
    document.addEventListener("click", (e) => {
      if (!state.enabled || e.__vr_synced__) return;
      const target = e.target instanceof HTMLElement ? e.target : null;
      if (!target) return;

      if (target.closest && (target.closest("#vr-floating-hud") || target.closest("#vr-hud-toggle-tab") || target.closest("#vr-playback-bar"))) {
        return;
      }

      const relX = (e.clientX || 0) / (window.innerWidth || 1);
      const relY = (e.clientY || 0) / (window.innerHeight || 1);

      const payload = {
        type: "VR_INTERACT_SYNC",
        action: "click",
        relX: relX,
        relY: relY,
        id: target.id || ""
      };

      try {
        if (window.parent && window.parent !== window) {
          window.parent.postMessage(payload, "*");
        }
        if (window.top && window.top !== window && window.top !== window.parent) {
          window.top.postMessage(payload, "*");
        }
        window.postMessage(payload, "*");
      } catch (err) {}
    }, true);

    // Input Text Mirroring
    document.addEventListener("input", (e) => {
      if (!state.enabled || e.__vr_synced__) return;
      const target = e.target instanceof HTMLElement ? e.target : null;
      if (!target) return;

      const relX = (target.getBoundingClientRect ? target.getBoundingClientRect().left : 0) / (window.innerWidth || 1);
      const relY = (target.getBoundingClientRect ? target.getBoundingClientRect().top : 0) / (window.innerHeight || 1);

      const payload = {
        type: "VR_INTERACT_SYNC",
        action: "input",
        relX: relX,
        relY: relY,
        id: target.id || "",
        value: "value" in target ? target.value : ""
      };

      try {
        if (window.parent && window.parent !== window) {
          window.parent.postMessage(payload, "*");
        }
        if (window.top && window.top !== window && window.top !== window.parent) {
          window.top.postMessage(payload, "*");
        }
        window.postMessage(payload, "*");
      } catch (err) {}
    }, true);
  }

  // Attach auto-synchronization listeners to any video in current context
  function attachVideoSyncToAll() {
    if (!state.enabled) return;
    attachInteractionSyncToDocument();
    const vids = document.querySelectorAll("video");
    vids.forEach((vid) => {
      if (vid.__vr_sync_attached__) return;
      vid.__vr_sync_attached__ = true;

      const notifyParent = (action) => {
        if (!state.enabled) return;
        try {
          const payload = {
            type: "VR_VIDEO_SYNC_ACTION",
            action: action,
            currentTime: vid.currentTime
          };
          if (window.parent && window.parent !== window) {
            window.parent.postMessage(payload, "*");
          }
          if (window.top && window.top !== window && window.top !== window.parent) {
            window.top.postMessage(payload, "*");
          }
          window.postMessage(payload, "*");
        } catch (e) {}
      };

      vid.addEventListener("play", () => notifyParent("play"));
      vid.addEventListener("pause", () => notifyParent("pause"));
      vid.addEventListener("seeked", () => notifyParent("seek"));
      vid.addEventListener("timeupdate", () => {
        if (Math.floor(vid.currentTime) % 3 === 0) {
          notifyParent("sync_time");
        }
      });
    });
  }

  // Global User Touch Gesture Unlocker: Synchronously unlock mirror video autoplay on mobile
  const unlockAllMirrorVideos = () => {
    if (!state.enabled) return;
    const allVids = Array.from(document.querySelectorAll("video"));
    if (shadowRoot) {
      allVids.push(...Array.from(shadowRoot.querySelectorAll("video")));
    }
    allVids.forEach((v) => {
      if (v !== activeMasterVideo) {
        v.muted = true;
      }
      if (activeMasterVideo && !activeMasterVideo.paused) {
        if (Math.abs(v.currentTime - activeMasterVideo.currentTime) > 0.25) {
          v.currentTime = activeMasterVideo.currentTime;
        }
        v.play().catch(() => {});
      }
    });
  };
  window.addEventListener("touchstart", unlockAllMirrorVideos, { capture: true, passive: true });
  window.addEventListener("pointerdown", unlockAllMirrorVideos, { capture: true, passive: true });
  window.addEventListener("click", unlockAllMirrorVideos, { capture: true, passive: true });

  function broadcastToIframes(enabled) {
    try {
      const iframes = Array.from(document.querySelectorAll("iframe"));
      if (shadowRoot) {
        const shadowIframes = Array.from(shadowRoot.querySelectorAll("iframe"));
        iframes.push(...shadowIframes);
      }
      iframes.forEach((frame) => {
        try {
          if (frame.contentWindow) {
            frame.contentWindow.postMessage({ type: "VR_FRAME_TOGGLE", enabled: enabled }, "*");
          }
        } catch (e) {}
      });
    } catch (e) {}
  }

  // Keyboard shortcut (Alt+V)
  window.addEventListener("keydown", (e) => {
    if (e.altKey && (e.key === "v" || e.key === "V")) {
      toggleVRMode();
      broadcastToIframes(state.enabled);
    }
  });

  // Handle Resize and Orientation changes
  window.addEventListener("resize", () => {
    if (state.enabled) applyTransforms();
  });
  window.addEventListener("orientationchange", () => {
    if (state.enabled) {
      setTimeout(applyTransforms, 120);
    }
  });

  // Fullscreen Protection: Intercept requestFullscreen and webkitEnterFullscreen so VR SBS mode never breaks
  const origRequestFullscreen = Element.prototype.requestFullscreen;
  const origWebkitRequestFullscreen = /** @type {any} */ (Element.prototype).webkitRequestFullscreen;
  const origWebkitEnterFullscreen = /** @type {any} */ (HTMLVideoElement.prototype).webkitEnterFullscreen;

  Element.prototype.requestFullscreen = function(options) {
    if (state.enabled) {
      if (!isTopFrame) {
        try {
          if (window.top) window.top.postMessage({ type: "VR_REQUEST_FULLSCREEN" }, "*");
        } catch (e) {}
        return Promise.resolve();
      } else if (hostEl) {
        if (origRequestFullscreen) {
          return origRequestFullscreen.call(hostEl, options).catch(() => {
            return origRequestFullscreen.call(document.documentElement, options);
          });
        }
      }
    }
    if (origRequestFullscreen) {
      return origRequestFullscreen.call(this, options);
    }
    return Promise.resolve();
  };

  if (origWebkitRequestFullscreen) {
    /** @type {any} */ (Element.prototype).webkitRequestFullscreen = function(options) {
      if (state.enabled) {
        if (!isTopFrame) {
          try {
            if (window.top) window.top.postMessage({ type: "VR_REQUEST_FULLSCREEN" }, "*");
          } catch (e) {}
          return;
        } else if (hostEl) {
          return origWebkitRequestFullscreen.call(hostEl, options);
        }
      }
      return origWebkitRequestFullscreen.call(this, options);
    };
  }

  if (origWebkitEnterFullscreen) {
    /** @type {any} */ (HTMLVideoElement.prototype).webkitEnterFullscreen = function() {
      if (state.enabled) {
        if (!isTopFrame) {
          try {
            if (window.top) window.top.postMessage({ type: "VR_REQUEST_FULLSCREEN" }, "*");
          } catch (e) {}
          return;
        } else if (hostEl) {
          if (origRequestFullscreen) {
            origRequestFullscreen.call(hostEl).catch(() => {});
          }
          return;
        }
      }
      return origWebkitEnterFullscreen.call(this);
    };
  }

  const handleFullscreenChange = () => {
    if (state.enabled && hostEl) {
      const fsEl = document.fullscreenElement || document.webkitFullscreenElement;
      if (fsEl && fsEl !== hostEl && !hostEl.contains(fsEl)) {
        if (hostEl.requestFullscreen) {
          hostEl.requestFullscreen().catch(() => {});
        } else if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen().catch(() => {});
        }
      }
    }
  };

  document.addEventListener("fullscreenchange", handleFullscreenChange);
  document.addEventListener("webkitfullscreenchange", handleFullscreenChange);

  function saveSettings() {
    if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({ vrSettings: state });
    }
  }

  function resetToDefaults() {
    state.zoom = 1.0;
    state.ipd = 0;
    state.brightness = 100;
    state.curved = false;
    state.curveIntensity = 12;
    state.aspectRatio = "16/9";
    state.gyroEnabled = false;
    state.opticalDividerWidth = 4;
    gyro.initialAlpha = null;
    gyro.initialBeta = null;
    gyro.targetYaw = 0;
    gyro.targetPitch = 0;
    gyro.currentYaw = 0;
    gyro.currentPitch = 0;
    applyTransforms();
    updateHUDControlsUI();
    saveSettings();
  }

  function toggleVRMode() {
    state.enabled = !state.enabled;
    if (state.enabled) {
      initVRSystem();
    } else {
      destroyVRSystem();
    }
    saveSettings();
  }

  function findMasterVideo() {
    const videos = Array.from(document.querySelectorAll("video"));
    if (videos.length === 0) return null;

    const sorted = videos.sort((a, b) => {
      const aRect = a.getBoundingClientRect();
      const bRect = b.getBoundingClientRect();
      const aArea = aRect.width * aRect.height;
      const bArea = bRect.width * bRect.height;
      const aPlaying = !a.paused && a.currentTime > 0;
      const bPlaying = !b.paused && b.currentTime > 0;
      if (aPlaying && !bPlaying) return -1;
      if (!aPlaying && bPlaying) return 1;
      return bArea - aArea;
    });

    return sorted[0] || null;
  }

  async function loadCSS() {
    try {
      if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.getURL) {
        const url = chrome.runtime.getURL("content.css");
        const res = await fetch(url);
        if (res.ok) {
          return await res.text();
        }
      }
    } catch (e) {}
    return EMBEDDED_FALLBACK_CSS;
  }

  async function initVRSystem() {
    if (!isTopFrame) {
      attachVideoSyncToAll();
      return;
    }

    if (document.getElementById("vr-mobile-side-host")) {
      return;
    }

    activeMasterVideo = findMasterVideo();

    hostEl = document.createElement("div");
    hostEl.id = "vr-mobile-side-host";
    shadowRoot = hostEl.attachShadow({ mode: "open" });

    const styleEl = document.createElement("style");
    const cssText = await loadCSS();
    styleEl.textContent = cssText || EMBEDDED_FALLBACK_CSS;
    shadowRoot.appendChild(styleEl);

    const container = document.createElement("div");
    container.className = "vr-viewport-container";
    container.id = "vr-viewport-container";

    container.innerHTML = `
      <!-- Left Eye Panel -->
      <div class="vr-eye-panel left-eye" id="vr-left-eye">
        <div class="vr-screen-wrapper" id="vr-left-wrapper"></div>
        <div class="vr-dimmer-layer"></div>
        <div class="vr-gaze-reticle" id="reticle-left">
          <div class="vr-gaze-dot"></div>
          <svg class="vr-gaze-svg-ring" viewBox="0 0 24 24"><circle class="vr-gaze-svg-circle" cx="12" cy="12" r="9"/></svg>
        </div>
      </div>

      <!-- Black Optical Divider -->
      <div class="vr-optical-divider" id="vr-optical-divider"></div>

      <!-- Right Eye Panel -->
      <div class="vr-eye-panel right-eye" id="vr-right-eye">
        <div class="vr-screen-wrapper" id="vr-right-wrapper"></div>
        <div class="vr-dimmer-layer"></div>
        <div class="vr-gaze-reticle" id="reticle-right">
          <div class="vr-gaze-dot"></div>
          <svg class="vr-gaze-svg-ring" viewBox="0 0 24 24"><circle class="vr-gaze-svg-circle" cx="12" cy="12" r="9"/></svg>
        </div>
      </div>

      <!-- Downward Spatial Gaze Dock (Hands-Free Quick Controls) -->
      <div class="vr-gaze-dock" id="vr-gaze-dock">
        <button class="vr-gaze-btn" id="gaze-btn-rewind" title="Mundur 10 Detik">⏪ -10s</button>
        <button class="vr-gaze-btn" id="gaze-btn-playpause" title="Play/Pause">⏯️ Play</button>
        <button class="vr-gaze-btn" id="gaze-btn-forward" title="Maju 10 Detik">⏩ +10s</button>
        <button class="vr-gaze-btn" id="gaze-btn-recenter" title="Kunci Layar ke Depan">🎯 Kunci Depan</button>
        <button class="vr-gaze-btn" id="gaze-btn-pos-up" title="Pindah Layar ke Atas">⬆️ Naik</button>
        <button class="vr-gaze-btn" id="gaze-btn-pos-down" title="Pindah Layar ke Bawah">⬇️ Turun</button>
        <button class="vr-gaze-btn" id="gaze-btn-hud" title="Menu Pengaturan HUD">🥽 HUD</button>
      </div>

      <!-- Action Toast Notification -->
      <div class="vr-action-toast" id="vr-action-toast">Action</div>

      <!-- Top Playback Bar -->
      <div class="vr-playback-bar" id="vr-playback-bar">
        <button class="vr-play-pause-btn" id="vr-play-btn" title="Play/Pause">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        </button>
        <span class="vr-time-display" id="vr-time-text">00:00 / 00:00</span>
      </div>

      <!-- Floating HUD Toggle Button -->
      <button class="vr-hud-toggle-tab" id="vr-hud-toggle-btn" title="Toggle HUD (Double Tap Screen)">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 15a3 3 0 100-6 3 3 0 000 6z"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
        <span>VR HUD</span>
      </button>

      <!-- Floating Control HUD -->
      <div class="vr-hud-container" id="vr-floating-hud">
        <div class="vr-hud-header">
          <div class="vr-hud-brand">
            <svg class="vr-hud-logo" viewBox="0 0 24 24"><path d="M21 7H3a2 2 0 00-2 2v6a2 2 0 002 2h4.5a2.5 2.5 0 002.5-2.5V14a1 1 0 011-1h2a1 1 0 011 1v.5a2.5 2.5 0 002.5 2.5H21a2 2 0 002-2V9a2 2 0 00-2-2zm-14 6a2 2 0 110-4 2 2 0 010 4zm10 0a2 2 0 110-4 2 2 0 010 4z"/></svg>
            <span class="vr-hud-title">VR Mobile Side</span>
            <span class="vr-hud-badge">Universal SBS</span>
          </div>
          <div class="vr-hud-header-actions">
            <button class="vr-hud-action-btn" id="btn-mode-toggle" title="Switch View Mode">Mode: Web</button>
            <button class="vr-hud-action-btn" id="btn-fullscreen-toggle" title="Full Screen">⛶</button>
            <button class="vr-hud-action-btn vr-hud-close-btn" id="vr-exit-btn">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              <span>Exit</span>
            </button>
          </div>
        </div>

        <!-- Quick Presets Bar on HUD -->
        <div class="vr-hud-presets-bar">
          <button class="vr-preset-chip active" data-preset="standard">🎬 Standard</button>
          <button class="vr-preset-chip" data-preset="imax">🍿 IMAX 3D</button>
          <button class="vr-preset-chip" data-preset="bedtime">🛏️ Bedtime</button>
        </div>

        <div class="vr-hud-grid">
          <!-- Distance / Zoom -->
          <div class="vr-hud-card">
            <div class="vr-hud-label">
              <span>Screen Zoom</span>
              <span class="vr-hud-value" id="val-zoom">100%</span>
            </div>
            <div class="vr-hud-stepper">
              <button class="vr-btn-step" id="btn-zoom-dec">−</button>
              <button class="vr-btn-step" id="btn-zoom-inc">+</button>
            </div>
          </div>

          <!-- IPD Adjustment -->
          <div class="vr-hud-card">
            <div class="vr-hud-label">
              <span>IPD Offset</span>
              <span class="vr-hud-value" id="val-ipd">0 px</span>
            </div>
            <div class="vr-hud-stepper">
              <button class="vr-btn-step" id="btn-ipd-dec">◀ In</button>
              <button class="vr-btn-step" id="btn-ipd-inc">Out ▶</button>
            </div>
          </div>

          <!-- Brightness Dimmer -->
          <div class="vr-hud-card">
            <div class="vr-hud-label">
              <span>Brightness</span>
              <span class="vr-hud-value" id="val-brightness">100%</span>
            </div>
            <div class="vr-hud-stepper">
              <button class="vr-btn-step" id="btn-bright-dec">Dim</button>
              <button class="vr-btn-step" id="btn-bright-inc">Bright</button>
            </div>
          </div>

          <!-- Curved Screen Simulation -->
          <div class="vr-hud-card">
            <div class="vr-hud-label">
              <span>Curved IMAX</span>
              <span class="vr-hud-value" id="val-curved">OFF</span>
            </div>
            <div class="vr-hud-toggle-group">
              <button class="vr-pill-btn" id="btn-curved-toggle">Toggle Curve</button>
            </div>
          </div>

          <!-- Aspect Ratio Lock -->
          <div class="vr-hud-card">
            <div class="vr-hud-label">
              <span>Aspect Ratio</span>
              <span class="vr-hud-value" id="val-aspect">16:9</span>
            </div>
            <div class="vr-hud-toggle-group">
              <button class="vr-pill-btn" id="btn-aspect-cycle">Cycle Ratio</button>
            </div>
          </div>

          <!-- Gyroscope Head Tracking -->
          <div class="vr-hud-card">
            <div class="vr-hud-label">
              <span>Head Track</span>
              <span class="vr-hud-value" id="val-gyro">Static</span>
            </div>
            <div class="vr-hud-toggle-group">
              <button class="vr-pill-btn" id="btn-gyro-toggle">Gyro Mode</button>
              <button class="vr-pill-btn" id="btn-gyro-recenter" title="Re-center View">🎯</button>
            </div>
          </div>
        </div>

        <div class="vr-hud-footer">
          <button class="vr-btn-secondary" id="btn-reset-defaults">↺ Reset Defaults</button>
          <div class="vr-hud-hint">Double-tap screen to show/hide HUD</div>
        </div>
      </div>
    `;

    shadowRoot.appendChild(container);
    document.documentElement.appendChild(hostEl);

    // Setup Duplication based on current mode
    renderSBSViewports();

    setupHUDEvents();

    if (state.gyroEnabled) {
      startGyroTracking();
    }

    startDOMObserver();
    applyTransforms();
    updateHUDControlsUI();
    startHUDTimer();
  }

  // Render SBS Viewports (Smart Priority: Video Direct Sync > Universal Web Duplication)
  function renderSBSViewports() {
    const leftWrapper = shadowRoot.getElementById("vr-left-wrapper");
    const rightWrapper = shadowRoot.getElementById("vr-right-wrapper");
    if (!leftWrapper || !rightWrapper) return;

    leftWrapper.innerHTML = "";
    rightWrapper.innerHTML = "";

    activeMasterVideo = findMasterVideo();

    if (activeMasterVideo) {
      setupMediaStreamDuplication(leftWrapper, rightWrapper);
    } else {
      setupUniversalPageDuplication(leftWrapper, rightWrapper);
    }
  }

  // Universal Master-Mirror Mode: Left is 100% Interactive Real Web / Video, Right is Pure Optical Mirror
  function setupUniversalPageDuplication(leftWrapper, rightWrapper) {
    if (canvasRenderLoop) {
      cancelAnimationFrame(canvasRenderLoop);
      canvasRenderLoop = null;
    }

    leftWrapper.innerHTML = "";
    rightWrapper.innerHTML = "";

    const container = shadowRoot ? shadowRoot.getElementById("vr-viewport-container") : null;
    if (container) {
      container.style.backgroundColor = "transparent";
    }

    // Check if master video already exists
    activeMasterVideo = findMasterVideo();
    if (activeMasterVideo) {
      setupMediaStreamDuplication(leftWrapper, rightWrapper);
      return;
    }

    // Left Eye: Allow direct pass-through to real webpage so all buttons, links, and players work natively
    const leftEye = shadowRoot ? shadowRoot.getElementById("vr-left-eye") : null;
    if (leftEye) {
      leftEye.style.pointerEvents = "none";
      leftEye.style.background = "transparent";
    }

    const rightEye = shadowRoot ? shadowRoot.getElementById("vr-right-eye") : null;
    if (rightEye) {
      rightEye.style.background = "transparent";
    }

    // Watch for any video that starts playing or enters the DOM
    const pollForVideo = () => {
      if (!state.enabled) return;
      const vid = findMasterVideo();
      if (vid && (vid.videoWidth > 0 || !vid.paused || vid.currentTime > 0 || vid.src || vid.currentSrc)) {
        if (leftEye) {
          leftEye.style.pointerEvents = "auto";
          leftEye.style.background = "#000000";
        }
        if (rightEye) {
          rightEye.style.background = "#000000";
        }
        if (container) {
          container.style.backgroundColor = "#000000";
        }
        setupMediaStreamDuplication(leftWrapper, rightWrapper);
        return;
      }
      setTimeout(pollForVideo, 350);
    };

    pollForVideo();
  }

  // Focused Media Stream Duplication - Master Left + 100% Lockstep Mirror Right Video
  function setupMediaStreamDuplication(leftWrapper, rightWrapper) {
    if (canvasRenderLoop) {
      cancelAnimationFrame(canvasRenderLoop);
      canvasRenderLoop = null;
    }

    const container = shadowRoot ? shadowRoot.getElementById("vr-viewport-container") : null;
    if (container) {
      container.style.backgroundColor = "#000000";
    }

    const leftEye = shadowRoot ? shadowRoot.getElementById("vr-left-eye") : null;
    if (leftEye) {
      leftEye.style.pointerEvents = "auto";
      leftEye.style.background = "#000000";
    }

    const rightEye = shadowRoot ? shadowRoot.getElementById("vr-right-eye") : null;
    if (rightEye) {
      rightEye.style.background = "#000000";
    }

    leftWrapper.innerHTML = "";
    rightWrapper.innerHTML = "";

    activeMasterVideo = activeMasterVideo || findMasterVideo();
    if (!activeMasterVideo) {
      setupLiveDOMStream(leftWrapper, rightWrapper);
      return;
    }

    // 1. Master Left Video: Interactive
    const leftVideo = document.createElement("video");
    leftVideo.className = "vr-media-element vr-master-media";
    leftVideo.autoplay = true;
    leftVideo.playsInline = true;
    leftVideo.muted = true; // Audio is supplied crystal clear by activeMasterVideo
    leftVideo.controls = false;
    leftVideo.setAttribute("playsinline", "");
    leftVideo.setAttribute("webkit-playsinline", "");

    // 2. Mirror Right Video: Pure Optical Clone (Bypasses CORS Canvas Tainting, Never Dark)
    const rightVideo = document.createElement("video");
    rightVideo.className = "vr-media-element vr-mirror-media";
    rightVideo.autoplay = true;
    rightVideo.playsInline = true;
    rightVideo.muted = true;
    rightVideo.controls = false;
    rightVideo.setAttribute("playsinline", "");
    rightVideo.setAttribute("webkit-playsinline", "");
    rightVideo.style.cssText = "pointer-events:none !important;user-select:none !important;";

    leftWrapper.appendChild(leftVideo);
    rightWrapper.appendChild(rightVideo);

    let streamWorking = false;

    // Method A: Direct Stream Capture Clone
    try {
      let stream = null;
      if (typeof activeMasterVideo.captureStream === "function") {
        stream = activeMasterVideo.captureStream();
      } else if (typeof activeMasterVideo.mozCaptureStream === "function") {
        stream = activeMasterVideo.mozCaptureStream();
      }

      if (stream && stream.active !== false && stream.getVideoTracks && stream.getVideoTracks().length > 0) {
        leftVideo.srcObject = stream;
        rightVideo.srcObject = stream;
        leftVideo.play().catch(() => {});
        rightVideo.play().catch(() => {});
        streamWorking = true;
      }
    } catch (err) {
      streamWorking = false;
    }

    // Method B: Direct Source Cloning (Bypasses CORS restrictions)
    if (!streamWorking && (activeMasterVideo.currentSrc || activeMasterVideo.src)) {
      try {
        const videoSrc = activeMasterVideo.currentSrc || activeMasterVideo.src;
        leftVideo.src = videoSrc;
        rightVideo.src = videoSrc;
        leftVideo.currentTime = activeMasterVideo.currentTime;
        rightVideo.currentTime = activeMasterVideo.currentTime;
        if (!activeMasterVideo.paused) {
          leftVideo.play().catch(() => {});
          rightVideo.play().catch(() => {});
        }
        streamWorking = true;

        const syncTime = () => {
          if (Math.abs(leftVideo.currentTime - activeMasterVideo.currentTime) > 0.25) {
            leftVideo.currentTime = activeMasterVideo.currentTime;
          }
          if (Math.abs(rightVideo.currentTime - activeMasterVideo.currentTime) > 0.25) {
            rightVideo.currentTime = activeMasterVideo.currentTime;
          }
        };
        activeMasterVideo.addEventListener("timeupdate", syncTime);
        activeMasterVideo.addEventListener("play", () => {
          leftVideo.play().catch(() => {});
          rightVideo.muted = true;
          rightVideo.play().catch(() => {});
        });
        activeMasterVideo.addEventListener("pause", () => {
          leftVideo.pause();
          rightVideo.pause();
        });
        activeMasterVideo.addEventListener("seeked", () => {
          leftVideo.currentTime = activeMasterVideo.currentTime;
          rightVideo.currentTime = activeMasterVideo.currentTime;
        });

        // Continuous Lockstep Keeper (every 250ms)
        const syncInterval = setInterval(() => {
          if (!state.enabled || !activeMasterVideo) {
            clearInterval(syncInterval);
            return;
          }
          if (!activeMasterVideo.paused && rightVideo.paused) {
            rightVideo.muted = true;
            rightVideo.play().catch(() => {});
          }
          if (!activeMasterVideo.paused && leftVideo.paused) {
            leftVideo.play().catch(() => {});
          }
          if (Math.abs(rightVideo.currentTime - activeMasterVideo.currentTime) > 0.3) {
            rightVideo.currentTime = activeMasterVideo.currentTime;
          }
        }, 250);
      } catch (e) {
        streamWorking = false;
      }
    }

    // Fallback: If neither worked, use hardware-accelerated canvas mirror
    if (!streamWorking) {
      setupCanvasMirror(activeMasterVideo, leftWrapper, rightWrapper);
    }

    // Master Control Tap: Single controller for play/pause on left panel
    const handleMasterTap = (e) => {
      if (e.target.closest("#vr-floating-hud") || e.target.closest("#vr-hud-toggle-tab") || e.target.closest("#vr-playback-bar") || e.target.closest("#vr-gaze-dock")) {
        return;
      }
      if (activeMasterVideo) {
        if (activeMasterVideo.paused) {
          activeMasterVideo.play().catch(() => {});
        } else {
          activeMasterVideo.pause();
        }
      }
    };

    leftWrapper.onclick = handleMasterTap;
    setupVideoSyncListeners();
  }

  // 60fps Frame-Accurate Synchronized Canvas Mirror
  function setupCanvasMirror(videoEl, leftWrapper, rightWrapper) {
    if (canvasRenderLoop) {
      cancelAnimationFrame(canvasRenderLoop);
      canvasRenderLoop = null;
    }

    leftWrapper.innerHTML = "";
    rightWrapper.innerHTML = "";

    const leftCanvas = document.createElement("canvas");
    const rightCanvas = document.createElement("canvas");

    [leftCanvas, rightCanvas].forEach((c) => {
      c.className = "vr-media-element";
    });

    leftWrapper.appendChild(leftCanvas);
    rightWrapper.appendChild(rightCanvas);

    const leftCtx = leftCanvas.getContext("2d");
    const rightCtx = rightCanvas.getContext("2d");

    function renderLoop() {
      if (!state.enabled) return;

      if (videoEl && (videoEl.videoWidth || videoEl.clientWidth) && (videoEl.videoHeight || videoEl.clientHeight)) {
        const w = videoEl.videoWidth || videoEl.clientWidth || 640;
        const h = videoEl.videoHeight || videoEl.clientHeight || 360;

        if (leftCanvas.width !== w) {
          leftCanvas.width = w;
          leftCanvas.height = h;
          rightCanvas.width = w;
          rightCanvas.height = h;
        }

        try {
          leftCtx.drawImage(videoEl, 0, 0, leftCanvas.width, leftCanvas.height);
          rightCtx.drawImage(videoEl, 0, 0, rightCanvas.width, rightCanvas.height);
        } catch (e) {}
      }

      canvasRenderLoop = requestAnimationFrame(renderLoop);
    }

    renderLoop();
  }

  // Live Screen / DOM Fallback if no video element is loaded yet
  function setupLiveDOMStream(leftWrapper, rightWrapper) {
    leftWrapper.innerHTML = "";
    rightWrapper.innerHTML = "";

    const liveCard = document.createElement("div");
    liveCard.className = "vr-media-element";
    liveCard.style.cssText = "width:90%;max-width:540px;padding:24px 20px;background:rgba(15,23,42,0.95);border-radius:14px;border:1px solid rgba(56,189,248,0.25);text-align:center;box-shadow:0 16px 40px rgba(0,0,0,0.8);";
    liveCard.innerHTML = `
      <div style="font-size:32px;margin-bottom:8px;">🥽</div>
      <h2 style="font-size:18px;font-weight:700;color:#38bdf8;margin-bottom:8px;">VR Mobile Side Active</h2>
      <p style="font-size:12.5px;color:#cbd5e1;line-height:1.5;margin-bottom:12px;">Putar film atau video apa pun di situs ini. Begitu video berputar, kedua panel kiri & kanan akan otomatis tersinkronisasi 100%.</p>
      <div style="font-size:11px;color:#94a3b8;background:rgba(30,41,59,0.8);padding:6px 12px;border-radius:8px;display:inline-block;">💡 Gunakan tombol Zoom (+) di HUD untuk memperbesar layar bioskop</div>
    `;

    leftWrapper.appendChild(liveCard);
    rightWrapper.appendChild(liveCard.cloneNode(true));
  }

  function startDOMObserver() {
    if (domObserver) domObserver.disconnect();
    domObserver = new MutationObserver(() => {
      if (!state.enabled) return;
      const currentVideo = findMasterVideo();
      if (currentVideo && (!activeMasterVideo || currentVideo !== activeMasterVideo)) {
        activeMasterVideo = currentVideo;
        renderSBSViewports();
      }
    });
    domObserver.observe(document.body, { childList: true, subtree: true });
  }

  function setupVideoSyncListeners() {
    if (!activeMasterVideo) return;

    const playBtn = shadowRoot.getElementById("vr-play-btn");
    const timeText = shadowRoot.getElementById("vr-time-text");

    const updatePlayIcon = () => {
      if (!playBtn) return;
      if (activeMasterVideo.paused) {
        playBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
      } else {
        playBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
      }
    };

    const formatTime = (sec) => {
      if (isNaN(sec) || !isFinite(sec)) return "00:00";
      const m = Math.floor(sec / 60);
      const s = Math.floor(sec % 60);
      return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    };

    const updateTimeDisplay = () => {
      if (!timeText) return;
      timeText.textContent = `${formatTime(activeMasterVideo.currentTime)} / ${formatTime(activeMasterVideo.duration)}`;
    };

    activeMasterVideo.addEventListener("play", updatePlayIcon);
    activeMasterVideo.addEventListener("pause", updatePlayIcon);
    activeMasterVideo.addEventListener("timeupdate", updateTimeDisplay);

    if (playBtn) {
      playBtn.onclick = () => {
        if (activeMasterVideo.paused) activeMasterVideo.play();
        else activeMasterVideo.pause();
      };
    }

    updatePlayIcon();
    updateTimeDisplay();
  }

  function setupHUDEvents() {
    const toggleBtn = shadowRoot.getElementById("vr-hud-toggle-btn");
    const exitBtn = shadowRoot.getElementById("vr-exit-btn");
    const fsBtn = shadowRoot.getElementById("btn-fullscreen-toggle");
    const modeBtn = shadowRoot.getElementById("btn-mode-toggle");
    const container = shadowRoot.getElementById("vr-viewport-container");

    const triggerHaptic = () => {
      if (navigator.vibrate) navigator.vibrate(15);
    };

    let lastTap = 0;
    container.addEventListener("click", (e) => {
      if (e.target.closest("#vr-floating-hud") || e.target.closest("#vr-hud-toggle-tab") || e.target.closest("#vr-playback-bar")) {
        return;
      }
      const currentTime = new Date().getTime();
      const tapLength = currentTime - lastTap;
      if (tapLength < 350 && tapLength > 0) {
        toggleHUDVisibility();
      }
      lastTap = currentTime;
    });

    toggleBtn.onclick = () => {
      triggerHaptic();
      toggleHUDVisibility();
    };

    exitBtn.onclick = () => {
      triggerHaptic();
      toggleVRMode();
      broadcastToIframes(false);
    };

    if (modeBtn) {
      modeBtn.onclick = () => {
        triggerHaptic();
        state.mode = state.mode === "fullweb" ? "media" : "fullweb";
        modeBtn.textContent = state.mode === "fullweb" ? "Mode: Web" : "Mode: Cinema";
        renderSBSViewports();
        saveSettings();
        resetHUDTimer();
      };
    }

    if (fsBtn) {
      fsBtn.onclick = () => {
        triggerHaptic();
        if (!document.fullscreenElement) {
          if (hostEl.requestFullscreen) hostEl.requestFullscreen().catch(console.warn);
          else if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(console.warn);
        } else {
          if (document.exitFullscreen) document.exitFullscreen().catch(console.warn);
        }
      };
    }

    // Quick Preset Chips on HUD
    const presetChips = shadowRoot.querySelectorAll(".vr-preset-chip");
    presetChips.forEach((chip) => {
      chip.onclick = () => {
        triggerHaptic();
        const preset = chip.getAttribute("data-preset");
        presetChips.forEach(c => c.classList.remove("active"));
        chip.classList.add("active");

        if (preset === "standard") {
          state.zoom = 1.0;
          state.ipd = 0;
          state.brightness = 100;
          state.curved = false;
          state.gyroEnabled = false;
          state.aspectRatio = "16/9";
        } else if (preset === "imax") {
          state.zoom = 1.2;
          state.ipd = 0;
          state.brightness = 100;
          state.curved = true;
          state.gyroEnabled = false;
          state.aspectRatio = "21/9";
        } else if (preset === "bedtime") {
          state.zoom = 0.85;
          state.ipd = 0;
          state.brightness = 50;
          state.curved = false;
          state.gyroEnabled = false;
          state.aspectRatio = "16/9";
        }

        applyTransforms();
        updateHUDControlsUI();
        saveSettings();
        resetHUDTimer();
      };
    });

    // Zoom Step
    shadowRoot.getElementById("btn-zoom-dec").onclick = () => {
      triggerHaptic();
      state.zoom = Math.max(0.5, parseFloat((state.zoom - 0.05).toFixed(2)));
      applyTransforms();
      updateHUDControlsUI();
      saveSettings();
      resetHUDTimer();
    };

    shadowRoot.getElementById("btn-zoom-inc").onclick = () => {
      triggerHaptic();
      state.zoom = Math.min(1.5, parseFloat((state.zoom + 0.05).toFixed(2)));
      applyTransforms();
      updateHUDControlsUI();
      saveSettings();
      resetHUDTimer();
    };

    // IPD Step
    shadowRoot.getElementById("btn-ipd-dec").onclick = () => {
      triggerHaptic();
      state.ipd = Math.max(-50, state.ipd - 2);
      applyTransforms();
      updateHUDControlsUI();
      saveSettings();
      resetHUDTimer();
    };

    shadowRoot.getElementById("btn-ipd-inc").onclick = () => {
      triggerHaptic();
      state.ipd = Math.min(50, state.ipd + 2);
      applyTransforms();
      updateHUDControlsUI();
      saveSettings();
      resetHUDTimer();
    };

    // Brightness Step
    shadowRoot.getElementById("btn-bright-dec").onclick = () => {
      triggerHaptic();
      state.brightness = Math.max(10, state.brightness - 10);
      applyTransforms();
      updateHUDControlsUI();
      saveSettings();
      resetHUDTimer();
    };

    shadowRoot.getElementById("btn-bright-inc").onclick = () => {
      triggerHaptic();
      state.brightness = Math.min(100, state.brightness + 10);
      applyTransforms();
      updateHUDControlsUI();
      saveSettings();
      resetHUDTimer();
    };

    // Curved Toggle
    shadowRoot.getElementById("btn-curved-toggle").onclick = () => {
      triggerHaptic();
      state.curved = !state.curved;
      applyTransforms();
      updateHUDControlsUI();
      saveSettings();
      resetHUDTimer();
    };

    // Aspect Ratio Cycle
    const aspectRatios = ["16/9", "21/9", "4/3", "auto"];
    shadowRoot.getElementById("btn-aspect-cycle").onclick = () => {
      triggerHaptic();
      const currIdx = aspectRatios.indexOf(state.aspectRatio);
      const nextIdx = (currIdx + 1) % aspectRatios.length;
      state.aspectRatio = aspectRatios[nextIdx];
      applyTransforms();
      updateHUDControlsUI();
      saveSettings();
      resetHUDTimer();
    };

    // Gaze Dock Hands-Free Quick Actions
    const gazeRewind = shadowRoot.getElementById("gaze-btn-rewind");
    const gazePlayPause = shadowRoot.getElementById("gaze-btn-playpause");
    const gazeForward = shadowRoot.getElementById("gaze-btn-forward");
    const gazeRecenter = shadowRoot.getElementById("gaze-btn-recenter");
    const gazePosUp = shadowRoot.getElementById("gaze-btn-pos-up");
    const gazePosDown = shadowRoot.getElementById("gaze-btn-pos-down");
    const gazeHud = shadowRoot.getElementById("gaze-btn-hud");

    const doRewind = () => {
      triggerHaptic();
      const v = activeMasterVideo || findMasterVideo();
      if (v) {
        v.currentTime = Math.max(0, v.currentTime - 10);
        showActionToast("⏪ Mundur 10 Detik");
      }
    };
    const doPlayPause = () => {
      triggerHaptic();
      const v = activeMasterVideo || findMasterVideo();
      if (v) {
        if (v.paused) {
          v.play().catch(() => {});
          showActionToast("▶️ Memutar Video");
        } else {
          v.pause();
          showActionToast("⏸️ Menjeda Video");
        }
      }
    };
    const doForward = () => {
      triggerHaptic();
      const v = activeMasterVideo || findMasterVideo();
      if (v) {
        v.currentTime = Math.min(v.duration || Infinity, v.currentTime + 10);
        showActionToast("⏩ Maju 10 Detik");
      }
    };
    const doRecenter = () => {
      triggerHaptic();
      recenterGyro();
      state.screenPitchOffset = 0;
      state.screenYawOffset = 0;
      applyTransforms();
      showActionToast("🎯 Layar Terkunci ke Depan");
    };
    const doPosUp = () => {
      triggerHaptic();
      state.screenPitchOffset = (state.screenPitchOffset || 0) + 10;
      applyTransforms();
      showActionToast(`⬆️ Layar Dinaikkan (+${state.screenPitchOffset}°)`);
    };
    const doPosDown = () => {
      triggerHaptic();
      state.screenPitchOffset = (state.screenPitchOffset || 0) - 10;
      applyTransforms();
      showActionToast(`⬇️ Layar Diturunkan (${state.screenPitchOffset}°)`);
    };
    const doToggleHUD = () => {
      triggerHaptic();
      toggleHUDVisibility();
    };

    if (gazeRewind) gazeRewind.onclick = doRewind;
    if (gazePlayPause) gazePlayPause.onclick = doPlayPause;
    if (gazeForward) gazeForward.onclick = doForward;
    if (gazeRecenter) gazeRecenter.onclick = doRecenter;
    if (gazePosUp) gazePosUp.onclick = doPosUp;
    if (gazePosDown) gazePosDown.onclick = doPosDown;
    if (gazeHud) gazeHud.onclick = doToggleHUD;

    // Gyro Mode Cycle & Recenter
    const gyroModes = ["immersive_360", "lazy_follow", "parallax_3d", "yaw_only"];
    shadowRoot.getElementById("btn-gyro-toggle").onclick = () => {
      triggerHaptic();
      if (!state.gyroEnabled) {
        state.gyroEnabled = true;
        state.gyroType = "immersive_360";
        startGyroTracking();
      } else {
        const currIdx = gyroModes.indexOf(state.gyroType || "immersive_360");
        if (currIdx === gyroModes.length - 1) {
          state.gyroEnabled = false;
          stopGyroTracking();
        } else {
          state.gyroType = gyroModes[currIdx + 1];
          recenterGyro();
        }
      }
      applyTransforms();
      updateHUDControlsUI();
      saveSettings();
      resetHUDTimer();
    };

    shadowRoot.getElementById("btn-gyro-recenter").onclick = () => {
      triggerHaptic();
      recenterGyro();
      resetHUDTimer();
    };

    // Reset Defaults
    shadowRoot.getElementById("btn-reset-defaults").onclick = () => {
      triggerHaptic();
      resetToDefaults();
      resetHUDTimer();
    };
  }

  function toggleHUDVisibility() {
    const hud = shadowRoot.getElementById("vr-floating-hud");
    if (!hud) return;
    state.hudVisible = !state.hudVisible;
    if (state.hudVisible) {
      hud.classList.remove("hud-hidden");
      startHUDTimer();
    } else {
      hud.classList.add("hud-hidden");
      clearTimeout(state.hudTimeout);
    }
  }

  function startHUDTimer() {
    clearTimeout(state.hudTimeout);
    state.hudTimeout = setTimeout(() => {
      const hud = shadowRoot ? shadowRoot.getElementById("vr-floating-hud") : null;
      if (hud) {
        hud.classList.add("hud-hidden");
        state.hudVisible = false;
      }
    }, 6000);
  }

  function resetHUDTimer() {
    if (state.hudVisible) startHUDTimer();
  }

  function updateHUDControlsUI() {
    if (!shadowRoot) return;

    const modeBtn = shadowRoot.getElementById("btn-mode-toggle");
    if (modeBtn) modeBtn.textContent = state.mode === "fullweb" ? "Mode: Web" : "Mode: Cinema";

    const valZoom = shadowRoot.getElementById("val-zoom");
    if (valZoom) valZoom.textContent = `${Math.round(state.zoom * 100)}%`;

    const valIpd = shadowRoot.getElementById("val-ipd");
    if (valIpd) valIpd.textContent = `${state.ipd > 0 ? "+" : ""}${state.ipd} px`;

    const valBrightness = shadowRoot.getElementById("val-brightness");
    if (valBrightness) valBrightness.textContent = `${state.brightness}%`;

    const valCurved = shadowRoot.getElementById("val-curved");
    const btnCurved = shadowRoot.getElementById("btn-curved-toggle");
    if (valCurved && btnCurved) {
      valCurved.textContent = state.curved ? "ON (IMAX)" : "OFF";
      btnCurved.classList.toggle("active", state.curved);
    }

    const valAspect = shadowRoot.getElementById("val-aspect");
    if (valAspect) {
      valAspect.textContent = state.aspectRatio === "auto" ? "Auto Fit" : state.aspectRatio.replace("/", ":");
    }

    const valGyro = shadowRoot.getElementById("val-gyro");
    const btnGyro = shadowRoot.getElementById("btn-gyro-toggle");
    if (valGyro && btnGyro) {
      if (!state.gyroEnabled) {
        valGyro.textContent = "Static Lock";
        btnGyro.classList.remove("active");
        btnGyro.textContent = "Gyro: OFF";
      } else {
        btnGyro.classList.add("active");
        const gType = state.gyroType || "immersive_360";
        if (gType === "immersive_360") {
          valGyro.textContent = "360° Bioskop";
          btnGyro.textContent = "🌐 360°";
        } else if (gType === "lazy_follow") {
          valGyro.textContent = "Follow Rebahan";
          btnGyro.textContent = "🛏️ Follow";
        } else if (gType === "parallax_3d") {
          valGyro.textContent = "3D Parallax";
          btnGyro.textContent = "✨ Parallax";
        } else if (gType === "yaw_only") {
          valGyro.textContent = "Horizontal";
          btnGyro.textContent = "↔️ Horiz";
        }
      }
    }
  }

  function getScreenOrientationAngle() {
    if (typeof window.orientation !== "undefined") {
      return window.orientation;
    }
    if (window.screen && window.screen.orientation && typeof window.screen.orientation.angle !== "undefined") {
      return window.screen.orientation.angle;
    }
    return window.innerWidth > window.innerHeight ? 90 : 0;
  }

  function shortestAngleDiff(target, base) {
    let diff = (target - base) % 360;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    return diff;
  }

  function showActionToast(msg) {
    if (!shadowRoot) return;
    const toast = shadowRoot.getElementById("vr-action-toast");
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("toast-show");
    clearTimeout(state.toastTimeout);
    state.toastTimeout = setTimeout(() => {
      toast.classList.remove("toast-show");
    }, 1700);
  }

  function applyTransforms() {
    if (!shadowRoot) return;

    const container = shadowRoot.getElementById("vr-viewport-container");
    const leftWrapper = shadowRoot.getElementById("vr-left-wrapper");
    const rightWrapper = shadowRoot.getElementById("vr-right-wrapper");
    const divider = shadowRoot.getElementById("vr-optical-divider");

    if (!container || !leftWrapper || !rightWrapper) return;

    const dimmerVal = ((100 - state.brightness) / 100).toFixed(2);
    container.style.setProperty("--vr-dimmer-val", dimmerVal);

    if (divider) {
      divider.style.setProperty("--vr-divider-width", `${state.opticalDividerWidth}px`);
    }

    container.classList.toggle("vr-curved-mode", state.curved);
    container.style.setProperty("--vr-curve-angle", `${state.curveIntensity}deg`);

    container.classList.remove("aspect-16-9", "aspect-21-9", "aspect-4-3", "aspect-auto");
    if (state.aspectRatio === "16/9") container.classList.add("aspect-16-9");
    else if (state.aspectRatio === "21/9") container.classList.add("aspect-21-9");
    else if (state.aspectRatio === "4/3") container.classList.add("aspect-4-3");
    else container.classList.add("aspect-auto");

    // Standard 3D Space Angular Orientation + Custom Screen Spatial Pitch & Yaw Offset
    const pitchOffset = state.screenPitchOffset || 0;
    const yawOffset = state.screenYawOffset || 0;

    const yawDeg = state.gyroEnabled ? gyro.currentYaw + yawOffset : yawOffset;
    const pitchDeg = state.gyroEnabled ? gyro.currentPitch + pitchOffset : pitchOffset;
    const rollDeg = state.gyroEnabled ? (gyro.currentRoll || 0) : 0;

    const curveLeft = state.curved ? state.curveIntensity : 0;
    const curveRight = state.curved ? -state.curveIntensity : 0;

    // True 3D Cinema Space Transform
    leftWrapper.style.transform = `
      perspective(1000px)
      rotateX(${(-pitchDeg).toFixed(2)}deg)
      rotateY(${(-yawDeg + curveLeft).toFixed(2)}deg)
      rotateZ(${(-rollDeg).toFixed(2)}deg)
      translate3d(calc(-${state.ipd}px), 0, 0)
      scale(${state.zoom})
    `;

    rightWrapper.style.transform = `
      perspective(1000px)
      rotateX(${(-pitchDeg).toFixed(2)}deg)
      rotateY(${(-yawDeg + curveRight).toFixed(2)}deg)
      rotateZ(${(-rollDeg).toFixed(2)}deg)
      translate3d(calc(${state.ipd}px), 0, 0)
      scale(${state.zoom})
    `;
  }

  function handleDeviceOrientation(event) {
    if (!state.gyroEnabled || !event) return;

    const alpha = event.alpha; // Yaw (0 to 360)
    const beta = event.beta;   // Pitch in portrait (-180 to 180)
    const gamma = event.gamma; // Roll in portrait (-90 to 90)

    if (alpha === null || typeof alpha === "undefined") return;

    if (gyro.initialAlpha === null) {
      gyro.initialAlpha = alpha;
      gyro.initialBeta = beta !== null ? beta : 0;
      gyro.initialGamma = gamma !== null ? gamma : 0;
      gyro.targetYaw = 0;
      gyro.targetPitch = 0;
      gyro.targetRoll = 0;
      gyro.currentYaw = 0;
      gyro.currentPitch = 0;
      gyro.currentRoll = 0;
      return;
    }

    const orientationAngle = getScreenOrientationAngle();
    let deltaYaw = shortestAngleDiff(alpha, gyro.initialAlpha);
    let deltaPitch = 0;
    let deltaRoll = 0;

    // Map axes according to physical device orientation inside VR headset (Landscape)
    if (orientationAngle === 90) {
      deltaPitch = (gamma !== null ? gamma - gyro.initialGamma : 0);
      deltaRoll = -(beta !== null ? beta - gyro.initialBeta : 0);
    } else if (orientationAngle === -90 || orientationAngle === 270) {
      deltaPitch = -(gamma !== null ? gamma - gyro.initialGamma : 0);
      deltaRoll = (beta !== null ? beta - gyro.initialBeta : 0);
    } else {
      deltaPitch = (beta !== null ? beta - gyro.initialBeta : 0);
      deltaRoll = (gamma !== null ? gamma - gyro.initialGamma : 0);
    }

    const sens = state.gyroSensitivity || 1.0;
    const gType = state.gyroType || "immersive_360";

    if (gType === "immersive_360") {
      gyro.targetYaw = deltaYaw * sens;
      gyro.targetPitch = Math.max(-65, Math.min(65, deltaPitch * sens));
      gyro.targetRoll = Math.max(-45, Math.min(45, deltaRoll * sens * 0.5));
    } else if (gType === "lazy_follow") {
      gyro.targetYaw = deltaYaw * sens * 0.55;
      gyro.targetPitch = Math.max(-40, Math.min(40, deltaPitch * sens * 0.55));
      gyro.targetRoll = 0;
      gyro.initialAlpha += deltaYaw * 0.012;
      gyro.initialGamma += deltaPitch * 0.012;
    } else if (gType === "parallax_3d") {
      gyro.targetYaw = Math.max(-14, Math.min(14, deltaYaw * sens * 0.35));
      gyro.targetPitch = Math.max(-12, Math.min(12, deltaPitch * sens * 0.35));
      gyro.targetRoll = Math.max(-8, Math.min(8, deltaRoll * sens * 0.25));
    } else if (gType === "yaw_only") {
      gyro.targetYaw = deltaYaw * sens;
      gyro.targetPitch = 0;
      gyro.targetRoll = 0;
    } else {
      gyro.targetYaw = 0;
      gyro.targetPitch = 0;
      gyro.targetRoll = 0;
    }
  }

  function updateGyroLoop() {
    if (!state.enabled || !state.gyroEnabled) return;

    // LERP damping factor
    const lerpFactor = state.gyroType === "lazy_follow" ? 0.06 : 0.10;
    gyro.currentYaw += (gyro.targetYaw - gyro.currentYaw) * lerpFactor;
    gyro.currentPitch += (gyro.targetPitch - gyro.currentPitch) * lerpFactor;
    gyro.currentRoll = (gyro.currentRoll || 0) + ((gyro.targetRoll || 0) - (gyro.currentRoll || 0)) * lerpFactor;

    // Downward Tilt Gaze Dock Auto-Trigger (Pitch < -16°)
    const gazeDock = shadowRoot ? shadowRoot.getElementById("vr-gaze-dock") : null;
    if (gazeDock) {
      if (gyro.currentPitch < -16) {
        gazeDock.classList.add("gaze-visible");
      } else if (gyro.currentPitch >= -8) {
        gazeDock.classList.remove("gaze-visible");
      }
    }

    // Hands-Free Gaze Raycast Dwell Auto-Clicker
    if (shadowRoot && state.gyroEnabled && gazeDock && gazeDock.classList.contains("gaze-visible")) {
      const centerX = window.innerWidth * 0.5;
      const centerY = window.innerHeight * 0.5;
      const rayEl = shadowRoot.elementFromPoint(window.innerWidth * 0.75, centerY) || shadowRoot.elementFromPoint(centerX, centerY);
      const gazeBtn = rayEl ? rayEl.closest(".vr-gaze-btn") : null;
      const reticles = shadowRoot.querySelectorAll(".vr-gaze-reticle");
      const circles = shadowRoot.querySelectorAll(".vr-gaze-svg-circle");

      if (gazeBtn) {
        if (state.gazeHoverTarget !== gazeBtn) {
          state.gazeHoverTarget = gazeBtn;
          state.gazeHoverStart = performance.now();
          state.gazeTriggered = false;
          gazeBtn.classList.add("gaze-targeted");
          reticles.forEach(r => r.classList.add("active"));
        } else {
          const elapsed = performance.now() - state.gazeHoverStart;
          const progress = Math.min(1, elapsed / 1100);
          const offset = 60 * (1 - progress);
          circles.forEach(c => c.style.strokeDashoffset = offset);

          if (progress >= 1 && !state.gazeTriggered) {
            state.gazeTriggered = true;
            gazeBtn.click();
            circles.forEach(c => c.style.strokeDashoffset = 60);
          }
        }
      } else {
        if (state.gazeHoverTarget) {
          state.gazeHoverTarget.classList.remove("gaze-targeted");
          state.gazeHoverTarget = null;
        }
        state.gazeTriggered = false;
        reticles.forEach(r => r.classList.remove("active"));
        circles.forEach(c => c.style.strokeDashoffset = 60);
      }
    }

    applyTransforms();
    gyro.animFrame = requestAnimationFrame(updateGyroLoop);
  }

  function startGyroTracking() {
    if (gyro.isListening) return;

    gyro.initialAlpha = null;
    gyro.initialBeta = null;
    gyro.initialGamma = null;

    const DevOrientation = /** @type {any} */ (window.DeviceOrientationEvent);
    if (DevOrientation && typeof DevOrientation.requestPermission === "function") {
      DevOrientation.requestPermission()
        .then((/** @type {string} */ response) => {
          if (response === "granted") {
            window.addEventListener("deviceorientation", handleDeviceOrientation, true);
            gyro.isListening = true;
            gyro.animFrame = requestAnimationFrame(updateGyroLoop);
          }
        })
        .catch(console.warn);
    } else {
      window.addEventListener("deviceorientation", handleDeviceOrientation, true);
      gyro.isListening = true;
      gyro.animFrame = requestAnimationFrame(updateGyroLoop);
    }
  }

  function stopGyroTracking() {
    if (gyro.isListening) {
      window.removeEventListener("deviceorientation", handleDeviceOrientation, true);
      gyro.isListening = false;
    }
    if (gyro.animFrame) {
      cancelAnimationFrame(gyro.animFrame);
      gyro.animFrame = null;
    }
    gyro.currentYaw = 0;
    gyro.currentPitch = 0;
    gyro.currentRoll = 0;
    gyro.targetYaw = 0;
    gyro.targetPitch = 0;
    gyro.targetRoll = 0;
    applyTransforms();
  }

  function recenterGyro() {
    gyro.initialAlpha = null;
    gyro.initialBeta = null;
    gyro.initialGamma = null;
    gyro.targetYaw = 0;
    gyro.targetPitch = 0;
    gyro.targetRoll = 0;
    gyro.currentYaw = 0;
    gyro.currentPitch = 0;
    gyro.currentRoll = 0;
    applyTransforms();
  }

  function destroyVRSystem() {
    stopGyroTracking();

    if (domObserver) {
      domObserver.disconnect();
      domObserver = null;
    }

    if (canvasRenderLoop) {
      cancelAnimationFrame(canvasRenderLoop);
      canvasRenderLoop = null;
    }

    if (hostEl && hostEl.parentNode) {
      hostEl.parentNode.removeChild(hostEl);
      hostEl = null;
      shadowRoot = null;
    }

    document.__vr_interaction_sync_attached__ = false;
    state.enabled = false;
  }
})();
