import { vnode } from './vnode'

export const h = function (sel, data, c) {
    // h('div',{},'文字') ----》1
    // h('div',{},[h()])  ----》2
    // h('div',{},h())    ----》3

    if (arguments.length != 3)
        throw new Error('参数必须为3个')
    if (typeof c == 'string' || typeof c == 'number') {
        // 1
        return vnode(sel, data, undefined, c, undefined)
    } else if (Array.isArray(c)) {
        // 2
        const children = [];
        c.forEach(item => {
            if (!(typeof item == 'object' && item.hasOwnProperty('sel'))) {
                throw new Error('数组参数内不是h函数');
            } else {
                // 收集children
                children.push(item);
            }
        })
        return vnode(sel, data, children, undefined, undefined)
    } else if (typeof c == 'object' && c.hasOwnProperty('sel')) {
        // 3
        const children = [c];
        return vnode(sel, data, children, undefined, undefined)
    } else {
        throw new Error('传入参数类型不对');
    }
}