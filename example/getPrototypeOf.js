// 拦截Object.getPrototypeOf(proxy)，返回一个对象。

const a = { x: 1 };
const b = Object.create(a);

console.log(Object.getPrototypeOf(b))


// const proxy = new Proxy(b, {
//   getPrototypeOf(target) {
//     return {};
//     // return Reflect.getPrototypeOf(target);
//   },
// });
// console.log(Object.getPrototypeOf(proxy));
