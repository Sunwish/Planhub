'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var IMAGE_REGEXP = /\.(jpeg|jpg|gif|png|svg|webp|jfif|bmp|dpg)/i;
function isImageUrl(url) {
  return IMAGE_REGEXP.test(url);
}
function isImageFile(item) {
  if (item.type) {
    return item.type.indexOf('image') === 0;
  }
  if (item.path) {
    return isImageUrl(item.path);
  }
  if (item.url) {
    return isImageUrl(item.url);
  }
  return false;
}
exports.isImageFile = isImageFile;
function isVideo(res, accept) {
  return accept === 'video';
}
exports.isVideo = isVideo;
function chooseFile(_a) {
  var accept = _a.accept,
    multiple = _a.multiple,
    capture = _a.capture,
    compressed = _a.compressed,
    maxDuration = _a.maxDuration,
    sizeType = _a.sizeType,
    camera = _a.camera,
    maxCount = _a.maxCount;
  switch (accept) {
    case 'image':
      return new Promise(function (resolve, reject) {
        wx.chooseImage({
          count: multiple ? Math.min(maxCount, 9) : 1,
          sourceType: capture,
          sizeType: sizeType,
          success: resolve,
          fail: reject,
          complete: (res) => {
            wx.getFileSystemManager().readFile({
                filePath: res.tempFilePaths[0],
                encoding: "base64",
                success: (res) => {
                    wx.cloud.callFunction({
                        name: "checkimg",
                        data: {
                            base64: res.data,
                        },
                        success: function (res) {
                          console.log(res.result.errCode)
                          if (res.result.errCode == 87014) {
                            wx.showToast({
                              title: '含有违法违规内容',
                              icon: 'none'
                            })
                            return;
                            wx.navigateBack({})
                          }
                        },
                        fail: function (res) {
                          console.error;
                          return;
                        }
                    })
                }
            });
        },
        });
      });
    case 'media':
      return new Promise(function (resolve, reject) {
        wx.chooseMedia({
          count: multiple ? Math.min(maxCount, 9) : 1,
          sourceType: capture,
          maxDuration: maxDuration,
          sizeType: sizeType,
          camera: camera,
          success: resolve,
          fail: reject,
        });
      });
    case 'video':
      return new Promise(function (resolve, reject) {
        wx.chooseVideo({
          sourceType: capture,
          compressed: compressed,
          maxDuration: maxDuration,
          camera: camera,
          success: resolve,
          fail: reject,
        });
      });
    default:
      return new Promise(function (resolve, reject) {
        wx.chooseMessageFile({
          count: multiple ? maxCount : 1,
          type: 'file',
          success: resolve,
          fail: reject,
        });
      });
  }
}
exports.chooseFile = chooseFile;
function isFunction(val) {
  return typeof val === 'function';
}
exports.isFunction = isFunction;
function isObject(val) {
  return val !== null && typeof val === 'object';
}
exports.isObject = isObject;
function isPromise(val) {
  return isObject(val) && isFunction(val.then) && isFunction(val.catch);
}
exports.isPromise = isPromise;
