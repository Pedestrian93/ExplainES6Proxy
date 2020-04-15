// 拦截对象属性的读取

const a = { name: "san" };

const proxy = new Proxy(a, {
  get(target, key, reciever) {
    return Reflect.get(target, key, reciever);
  },
});

console.log(proxy.name);

// TODO
// undefined checker
