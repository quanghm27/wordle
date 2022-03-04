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

export function makeKeyFrom(string) {
    if (isNumeric(string)) {
        return string
    }
    return alphaToNumber(string)
}

function isNumeric(value) {
    return /^-?\d+$/.test(value);
}

function alphaToNumber(string) {
    return string.split('')
                .map(str => str.charCodeAt(0) - 65)
                .join('')
}