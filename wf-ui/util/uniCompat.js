const listeners = new Map();

function ensureArray(value) {
  return Array.isArray(value) ? value : value != null ? [value] : [];
}

function openFileChooser({ multiple = true, accept = '*/*' }, callback) {
  const input = document.createElement('input');
  input.type = 'file';
  input.style.display = 'none';
  input.multiple = multiple;
  input.accept = accept;
  document.body.appendChild(input);
  input.addEventListener('change', () => {
    const files = Array.from(input.files || []).map((file) => {
      const objectUrl = URL.createObjectURL(file);
      return {
        file,
        name: file.name,
        size: file.size,
        tempFilePath: objectUrl,
        path: objectUrl,
      };
    });
    callback({ tempFiles: files });
    document.body.removeChild(input);
  });
  input.click();
}

export function showToast({ title = '', icon, position } = {}) {
  const message = [title, position].filter(Boolean).join('\n');
  if (message) {
    window.alert(message);
  }
}

export function showModal({ title = '', content = '', success } = {}) {
  const message = [title, content].filter(Boolean).join('\n');
  const confirm = window.confirm(message || '');
  success?.({ confirm, cancel: !confirm });
}

export function previewImage({ urls = [], current } = {}) {
  const list = ensureArray(urls);
  const target = current || list[0];
  if (target) {
    window.open(target, '_blank');
  }
}

export function downloadFile({ url, success, fail } = {}) {
  fetch(url)
    .then(async (response) => {
      if (!response.ok) throw new Error('Network response was not ok');
      const blob = await response.blob();
      const tempFilePath = URL.createObjectURL(blob);
      success?.({ tempFilePath, statusCode: response.status });
    })
    .catch((error) => {
      fail?.(error);
    });
}

export function openDocument({ filePath } = {}) {
  if (filePath) {
    window.open(filePath, '_blank');
  }
}

export function getSystemInfoSync() {
  return {
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight,
  };
}

export function on(event, handler) {
  if (!listeners.has(event)) {
    listeners.set(event, new Set());
  }
  listeners.get(event).add(handler);
}

export function off(event, handler) {
  listeners.get(event)?.delete(handler);
}

export function emit(event, payload) {
  listeners.get(event)?.forEach((handler) => handler(payload));
}

export function navigateTo({ url } = {}) {
  if (url) {
    window.open(url, '_blank');
  }
}

export function navigateBack() {
  window.history.back();
}

export function getLocation({ success, fail } = {}) {
  if (!navigator.geolocation) {
    fail?.(new Error('Geolocation is not supported'));
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (position) => {
      success?.({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    },
    (error) => {
      fail?.(error);
    }
  );
}

export function createSelectorQuery() {
  let context = document;
  return {
    in(component) {
      context = component?.$el || document;
      return this;
    },
    select(selector) {
      const root = context instanceof Element ? context : context.documentElement || document;
      const element = root.querySelector(selector);
      return {
        boundingClientRect(callback) {
          const rect = element?.getBoundingClientRect?.();
          if (callback) {
            callback(rect);
          }
          return this;
        },
      };
    },
    exec() {},
  };
}

function wrapCanvasContext(ctx) {
  if (!ctx) return null;
  return {
    setFillStyle(color) {
      ctx.fillStyle = color;
    },
    setStrokeStyle(color) {
      ctx.strokeStyle = color;
    },
    setGlobalAlpha(alpha) {
      ctx.globalAlpha = alpha;
    },
    clearRect(...args) {
      ctx.clearRect(...args);
    },
    draw() {},
    beginPath(...args) {
      ctx.beginPath(...args);
    },
    moveTo(...args) {
      ctx.moveTo(...args);
    },
    bezierCurveTo(...args) {
      ctx.bezierCurveTo(...args);
    },
    stroke(...args) {
      ctx.stroke(...args);
    },
    fill(...args) {
      ctx.fill(...args);
    },
  };
}

export function createCanvasContext(canvasId, component) {
  const root = component?.$el || document;
  const canvas = (root instanceof Element ? root : document).querySelector(`#${canvasId}`);
  const ctx = canvas?.getContext('2d');
  return wrapCanvasContext(ctx);
}

export function canvasToTempFilePath({ canvasId, quality = 1, fileType = 'png', success, fail, complete } = {}, component) {
  try {
    const root = component?.$el || document;
    const canvas = (root instanceof Element ? root : document).querySelector(`#${canvasId}`);
    if (!canvas) throw new Error('Canvas not found');
    const dataUrl = canvas.toDataURL(`image/${fileType}`, quality);
    success?.({ tempFilePath: dataUrl });
  } catch (error) {
    fail?.(error);
  } finally {
    complete?.();
  }
}

export function createMapContext(mapId, component) {
  return {
    getCenterLocation({ success } = {}) {
      const latitude = component?.latitude ?? 0;
      const longitude = component?.longitude ?? 0;
      success?.({ latitude, longitude });
    },
  };
}

export function chooseImage(options = {}) {
  openFileChooser({ accept: 'image/*' }, options.success || (() => {}));
}

export function chooseMessageFile(options = {}) {
  openFileChooser({ accept: '*/*' }, options.success || (() => {}));
}

export function chooseMedia(options = {}) {
  openFileChooser({ accept: 'image/*,video/*' }, options.success || (() => {}));
}

export default {
  showToast,
  showModal,
  previewImage,
  downloadFile,
  openDocument,
  getSystemInfoSync,
  on,
  off,
  emit,
  navigateTo,
  navigateBack,
  getLocation,
  createSelectorQuery,
  createCanvasContext,
  canvasToTempFilePath,
  createMapContext,
  chooseImage,
  chooseMessageFile,
  chooseMedia,
};
