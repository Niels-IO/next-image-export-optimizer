function _arrayLikeToArray(arr, len) {
    (null == len || len > arr.length) && (len = arr.length);
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _extends() {
    return (_extends = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source)Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
        }
        return target;
    }).apply(this, arguments);
}
import dynamic from "next/dynamic";
import React, { useState } from "react";
var Image = dynamic(function() {
    return import("next/image");
}, {
    ssr: !1
}), splitFilePath = function(param) {
    var filePath = param.filePath, filenameWithExtension = filePath.split("\\").pop().split("/").pop(), filePathWithoutFilename = filePath.split(filenameWithExtension).shift(), fileExtension = filePath.split(".").pop(), filenameWithoutExtension = filenameWithExtension.substring(0, filenameWithExtension.lastIndexOf(".")) || filenameWithExtension;
    return {
        path: filePathWithoutFilename,
        filename: filenameWithoutExtension,
        extension: fileExtension
    };
}, optimizedLoader = function(param) {
    var src = param.src, width = param.width, ref = splitFilePath({
        filePath: src
    }), filename = ref.filename, path = ref.path, extension = ref.extension, processedExtension = extension;
    return !0 === process.env.storePicturesInWEBP && [
        "JPG",
        "JPEG",
        "PNG"
    ].includes(extension.toUpperCase()) && (processedExtension = "WEBP"), "".concat(path, "nextImageExportOptimizer/").concat(filename, "-opt-").concat(width, ".").concat(processedExtension.toUpperCase());
};
export default function(_param) {
    var arr, i, src = _param.src, rest = function(source, excluded) {
        if (null == source) return {};
        var key, i, target = function(source, excluded) {
            if (null == source) return {};
            var key, i, target = {}, sourceKeys = Object.keys(source);
            for(i = 0; i < sourceKeys.length; i++)key = sourceKeys[i], excluded.indexOf(key) >= 0 || (target[key] = source[key]);
            return target;
        }(source, excluded);
        if (Object.getOwnPropertySymbols) {
            var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
            for(i = 0; i < sourceSymbolKeys.length; i++)key = sourceSymbolKeys[i], !(excluded.indexOf(key) >= 0) && Object.prototype.propertyIsEnumerable.call(source, key) && (target[key] = source[key]);
        }
        return target;
    }(_param, [
        "src"
    ]), ref = (i = 2, function(arr) {
        if (Array.isArray(arr)) return arr;
    }(arr = useState(!1)) || function(arr, i) {
        var _s, _e, _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"];
        if (null != _i) {
            var _arr = [], _n = !0, _d = !1;
            try {
                for(_i = _i.call(arr); !(_n = (_s = _i.next()).done) && (_arr.push(_s.value), !i || _arr.length !== i); _n = !0);
            } catch (err) {
                _d = !0, _e = err;
            } finally{
                try {
                    _n || null == _i.return || _i.return();
                } finally{
                    if (_d) throw _e;
                }
            }
            return _arr;
        }
    }(arr, i) || function(o, minLen) {
        if (o) {
            if ("string" == typeof o) return _arrayLikeToArray(o, minLen);
            var n = Object.prototype.toString.call(o).slice(8, -1);
            if ("Object" === n && o.constructor && (n = o.constructor.name), "Map" === n || "Set" === n) return Array.from(n);
            if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
        }
    }(arr, i) || function() {
        throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }()), imageError = ref[0], setImageError = ref[1];
    return React.createElement(Image, _extends({}, rest, {
        loader: imageError ? function(param) {
            return param.src;
        } : optimizedLoader,
        src: src,
        onError: function() {
            setImageError(!0);
        }
    }));
};


//# sourceMappingURL=output.js.map