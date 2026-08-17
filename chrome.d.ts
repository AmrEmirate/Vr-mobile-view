declare namespace chrome {
  namespace runtime {
    const id: string;
    const lastError: { message?: string } | undefined;
    function getURL(path: string): string;
    const onMessage: {
      addListener(callback: (message: any, sender: any, sendResponse: (response?: any) => void) => boolean | void): void;
    };
    const onInstalled: {
      addListener(callback: (details: any) => void): void;
    };
    function sendMessage(message: any, responseCallback?: (response: any) => void): void;
  }
  namespace storage {
    interface StorageArea {
      get(keys: string | string[] | object | null, callback?: (items: { [key: string]: any }) => void): Promise<{ [key: string]: any }>;
      set(items: { [key: string]: any }, callback?: () => void): Promise<void>;
    }
    const local: StorageArea;
    const sync: StorageArea;
  }
  namespace tabs {
    interface Tab {
      id?: number;
      url?: string;
      title?: string;
      active?: boolean;
    }
    function query(queryInfo: { active?: boolean; currentWindow?: boolean; [key: string]: any }, callback?: (result: Tab[]) => void): Promise<Tab[]>;
    function sendMessage(tabId: number, message: any, callback?: (response: any) => void): Promise<any>;
  }
  namespace scripting {
    function executeScript(injection: {
      target: { tabId: number; allFrames?: boolean };
      files?: string[];
      func?: (...args: any[]) => any;
      args?: any[];
    }): Promise<any>;
  }
  namespace action {
    function setBadgeText(details: { text: string; tabId?: number }): Promise<void>;
    function setBadgeBackgroundColor(details: { color: string | number[]; tabId?: number }): Promise<void>;
    function setTitle(details: { title: string; tabId?: number }): Promise<void>;
  }
  namespace contextMenus {
    function removeAll(callback?: () => void): void;
    function create(createProperties: any, callback?: () => void): void;
    const onClicked: {
      addListener(callback: (info: any, tab?: any) => void): void;
    };
  }
  namespace commands {
    const onCommand: {
      addListener(callback: (command: string) => void): void;
    };
  }
}

interface Window {
  __VR_MOBILE_SIDE_INITIALIZED__?: boolean;
}

interface DeviceOrientationEventConstructor {
  new (type: string, eventInitDict?: DeviceOrientationEventInit): DeviceOrientationEvent;
  prototype: DeviceOrientationEvent;
  requestPermission?(): Promise<string>;
}

declare var DeviceOrientationEvent: DeviceOrientationEventConstructor;

interface HTMLVideoElement {
  captureStream?(): MediaStream;
  mozCaptureStream?(): MediaStream;
  __vr_sync_attached__?: boolean;
}

interface Document {
  __vr_interaction_sync_attached__?: boolean;
  webkitFullscreenElement?: Element | null;
}

interface Event {
  __vr_synced__?: boolean;
}
