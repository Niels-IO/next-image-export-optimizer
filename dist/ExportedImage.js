"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = void 0;
var _dynamic = _interopRequireDefault(require("next/dynamic"));
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
}
function _extends() {
    _extends = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source){
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return _extends.apply(this, arguments);
}
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj;
    } else {
        var newObj = {};
        if (obj != null) {
            for(var key in obj){
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {};
                    if (desc.get || desc.set) {
                        Object.defineProperty(newObj, key, desc);
                    } else {
                        newObj[key] = obj[key];
                    }
                }
            }
        }
        newObj.default = obj;
        return newObj;
    }
}
function _iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
        for(_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _objectWithoutProperties(source, excluded) {
    if (source == null) return {};
    var target = _objectWithoutPropertiesLoose(source, excluded);
    var key, i;
    if (Object.getOwnPropertySymbols) {
        var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
        for(i = 0; i < sourceSymbolKeys.length; i++){
            key = sourceSymbolKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
    }
    return target;
}
function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;
    for(i = 0; i < sourceKeys.length; i++){
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        target[key] = source[key];
    }
    return target;
}
function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}
function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
var Image = (0, _dynamic).default(function() {
    return Promise.resolve().then(function() {
        return _interopRequireWildcard(require("next/image"));
    });
}, {
    ssr: false
});
var splitFilePath = function(param) {
    var filePath = param.filePath;
    var filenameWithExtension = filePath.split("\\").pop().split("/").pop();
    var filePathWithoutFilename = filePath.split(filenameWithExtension).shift();
    var fileExtension = filePath.split(".").pop();
    var filenameWithoutExtension = filenameWithExtension.substring(0, filenameWithExtension.lastIndexOf(".")) || filenameWithExtension;
    return {
        path: filePathWithoutFilename,
        filename: filenameWithoutExtension,
        extension: fileExtension
    };
};
var optimizedLoader = function(param) {
    var src = param.src, width = param.width;
    var ref = splitFilePath({
        filePath: src
    }), filename = ref.filename, path = ref.path, extension = ref.extension;
    if (![
        "JPG",
        "JPEG",
        "WEBP",
        "PNG",
        "AVIF"
    ].includes(extension.toUpperCase())) {
        return src;
    }
    var processedExtension = extension;
    if (process.env.storePicturesInWEBP === true && [
        "JPG",
        "JPEG",
        "PNG"
    ].includes(extension.toUpperCase())) {
        processedExtension = "WEBP";
    }
    return "".concat(path).concat(filename, "-opt-").concat(width, ".").concat(processedExtension.toUpperCase());
};
var fallbackLoader = function(param) {
    var src = param.src;
    return src;
};
function ExportedImage(_param) {
    var src = _param.src, rest = _objectWithoutProperties(_param, [
        "src"
    ]);
    var ref = _slicedToArray((0, _react).useState(false), 2), imageError = ref[0], setImageError = ref[1];
    return _react.default.createElement(Image, _extends({}, rest, {
        loader: imageError ? fallbackLoader : optimizedLoader,
        src: src,
        onError: function() {
            setImageError(true);
        }
    }));
}
ExportedImage.propTypes = {
    src: _propTypes.default.string.isRequired,
    alt: _propTypes.default.string.isRequired,
    width: _propTypes.default.number,
    height: _propTypes.default.number,
    layout: _propTypes.default.string,
    sizes: _propTypes.default.string,
    priority: _propTypes.default.bool,
    placeholder: _propTypes.default.string,
    objectFit: _propTypes.default.string,
    objectPosition: _propTypes.default.string,
    onLoadingComplete: _propTypes.default.func,
    blurDataURL: _propTypes.default.string
};
var _default = ExportedImage;
exports.default = _default;


//# sourceMappingURL=ExportedImage.js.map