/**
 * 判断该值是否为空
 * @function
 * @param {*} value 任意值
 * @returns {Boolean}  该值是否为空
 */
export default function defined(value) {
    return value !== undefined && value !== null;
}

export function defaultValue(a, b) {
    if (a !== undefined && a !== null) {
        return a;
    }
    return b;
}