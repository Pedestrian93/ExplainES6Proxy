// 拦截Object.setPrototypeOf(proxy, proto)，返回一个布尔值

const a = { name: "san" };
const b = { name: "x" };

// const proxy = new Proxy(a, {
//   setPrototypeOf(target, prototype) {
//     return false;
//     // return Reflect.setPrototypeOf(target, prototype);
//   },
// });

Object.setPrototypeOf(a, b);

console.log(Object.getPrototypeOf(a));
console.log(Object.getPrototypeOf(b));
