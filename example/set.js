// 拦截对象属性的设置
const a = { name: "san" };

const proxy = new Proxy(a, {
  set(target, key, value, reciever) {
    return Reflect.set(target, key, value, reciever);
  },
});

proxy.name = "biejia";
console.log(a.name)
console.log(proxy.name)

// TODO: Object only has Number value
