export function encode(key, text) {
    return encodeURIComponent(text.replace(/[^\0]/g, function(x, i) {
        var code = x.charCodeAt(0) ^ key.charCodeAt(i % key.length);
        return String.fromCharCode(code);
    }));
}

export function decode(key, text) {
    return decodeURIComponent(text).replace(/[^\0]/g, function(x, i) {
        var code = x.charCodeAt(0) ^ key.charCodeAt(i % key.length);
        return String.fromCharCode(code);
    });
}