import { vnode } from './vnode'

export const init = function (arr = []) {
    return patch
}

function patch(oldVnode, newVnode) {
    if (oldVnode.sel == '' || oldVnode.sel == undefined) {
        oldVnode = vnode(oldVnode.tagName.toLowerCase(), {}, [], undefined, oldVnode);
    }

    if (oldVnode.key === newVnode.key && oldVnode.sel === newVnode.sel) {
        patchVnode(oldVnode, newVnode)
    } else {
        //不同节点
        const newVnodeElm = creatElm(newVnode);
        if (newVnodeElm) {
            oldVnode.elm.parentNode.insertBefore(newVnodeElm, oldVnode.elm);
        }
        oldVnode.elm.parentNode.removeChild(oldVnode.elm)
    }
}

function creatElm(vnode) {
    let domNode = document.createElement(vnode.sel);
    if (vnode.text != '' && (vnode.children == undefined || vnode.children.length == 0)) {
        // document.createTextNode()
        domNode.innerText = vnode.text;
    } else if (Array.isArray(vnode.children) && vnode.children.length > 0) {
        vnode.children.forEach(item => {
            const chDom = creatElm(item);
            domNode.appendChild(chDom)
        })
    }
    vnode.elm = domNode
    return vnode.elm;
}

// 同一个节点--比较节点上树
function patchVnode(oldVnode, newVnode) {
    //同一个节点
    if (newVnode === oldVnode) return;
    if (newVnode.text !== '' && (newVnode.children === undefined || newVnode.children.length == 0)) {
        if (oldVnode.text !== newVnode.text) {
            oldVnode.elm.innerText = newVnode.text
        }
    } else {
        if (oldVnode.children != undefined && oldVnode.children.length > 0) {
            // 旧节点有子节点,新的也有子节点
            updateChildren(oldVnode.elm, oldVnode.children, newVnode.children)
        } else {
            // 旧节点没有子节点
            oldVnode.elm.innerHTML = '';
            newVnode.children.forEach(item => {
                const dom = creatElm(item);
                oldVnode.elm.appendChild(dom);
            })
        }
    }
}

function updateChildren(parentElm, oldCh, newCh) {
    // console.log(oldCh, newCh)

    let oldStartIndex = 0;
    let oldEndIndex = oldCh.length - 1;

    let newStartIndex = 0;
    let newEndIndex = newCh.length - 1;

    let oldStartNode = oldCh[oldStartIndex];
    let oldEndNode = oldCh[oldEndIndex];
    let newStartNode = newCh[newStartIndex];
    let newEndNode = newCh[newEndIndex];

    let oldKeyToIdx;
    let idxInOld;

    while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
        if (oldStartNode === undefined) {
            oldStartNode = oldCh[++oldStartIndex]
        } else if (oldEndNode === undefined) {
            oldEndNode = oldCh[--oldEndIndex]
        } else if (newStartNode === undefined) {
            newStartNode = newCh[++newStartIndex]
        } else if (newEndNode === undefined) {
            newEndNode = newCh[--newEndIndex]
        } else if (isSameNode(oldStartNode, newStartNode)) {
            console.log('①')
            // 新前 与 旧前
            patchVnode(oldStartNode, newStartNode)
            oldStartNode = oldCh[++oldStartIndex]
            newStartNode = newCh[++newStartIndex]
        } else if (isSameNode(oldEndNode, newEndNode)) {
            console.log('②')
            //新后 与 旧后
            patchVnode(oldEndNode, newEndNode)

            oldEndNode = oldCh[--oldEndIndex]
            newEndNode = newCh[--newEndIndex]
        } else if (isSameNode(oldStartNode, newEndNode)) {
            console.log('③')
            //新后 与 旧前  --- 新后节点移动到旧后之后
            patchVnode(oldStartNode, newEndNode)

            parentElm.insertBefore(newEndNode.elm, oldEndNode.elm.nextSibling)

            oldStartNode = oldCh[++oldStartIndex]
            newEndNode = newCh[--newEndIndex]
        } else if (isSameNode(oldEndNode, newStartNode)) {
            console.log('④', newStartNode)
            //新前 与 旧后  --- 新前节点移动到旧前之前
            patchVnode(oldEndNode, newStartNode)

            parentElm.insertBefore(oldEndNode.elm, oldStartNode.elm)

            oldEndNode = oldCh[--oldEndIndex]
            newStartNode = newCh[++newStartIndex]
        } else {
            // 其他非正常情况
            console.log('⑤')
            if (oldKeyToIdx === undefined) {
                oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIndex, oldEndIndex)
            }
            idxInOld = oldKeyToIdx[newStartNode.key]
            if (!idxInOld) {
                parentElm.insertBefore(creatElm(newStartNode), oldStartNode.elm)
            } else {
                let oldElm = oldCh[idxInOld];
                if (oldElm.sel !== newStartNode.sel) {
                    parentElm.insertBefore(creatElm(newStartNode), oldStartNode.elm)
                } else {
                    patchVnode(oldElm, newStartNode)
                    oldCh[idxInOld] = undefined;
                    parentElm.insertBefore(oldElm.elm, oldStartNode.elm)
                }
            }
            newStartNode = newCh[++newStartIndex];
        }
    }

    if ((newStartIndex <= newEndIndex)) {
        console.log('还有没处理的新节点')
        const before = newCh[newStartIndex + 1] == null ? null : newCh[newStartIndex + 1].elm
        for (let i = newStartIndex; i <= newEndIndex; i++) {
            parentElm.insertBefore(creatElm(newCh[i]), before)
        }
    } else if ((oldStartIndex <= oldEndIndex)) {
        for (let i = oldStartIndex; i <= oldEndIndex; i++) {
            oldCh[i] && parentElm.removeChild(oldCh[i].elm)
        }
    }

}
function createKeyToOldIdx(children, beginIdx, endIdx) {
    let map = {}
    children.forEach((item, i) => {
        map[item.key] = i;
    })
    return map;
}

function isSameNode(node1, node2) {
    return node1.sel === node2.sel && node1.key === node2.key
}