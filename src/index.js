import { h, init } from "../utils/mysnabbdom/index.js"

const app = document.getElementById('root');
const btn = document.getElementById('btn');

const patch = init();


// patch(app,h('div',{},'哈哈'))
const node1 = h('ul', {}, '文字，没有子节点');

const node2 = h('ul', {}, [
    h('li', {key:'a'}, 'A'),
    h('li', {key:'b'}, 'B'),
    h('li', {key:'c'}, 'C'),
]);


const vnode5 = h("ul", {}, {sel:'li',text:'sss'});

const node3 = h('ul', {}, '换内容')
const node4 = h('ul', {}, [
    h('li', {key:'d'}, 'd'),
    h('li', {key:'m'}, 'm'),
    h('li', {key:'b'}, 'B'),
    h('li', {key:'n'}, 'n'),
    h('li', {key:'xn'}, 'nw'),
    h('li', {key:'ns'}, 'nd'),
]);
patch(app, node2)

btn.onclick = function () {
    patch(node2, node4) 
}