// 拦截delete proxy[propKey]的操作，返回一个布尔值

const a = { name: "san" };
const proxy = new Proxy(a, {
  deleteProperty(target, key) {
    if (key === "name") {
      return false;
    }
    return Reflect.deleteProperty(target, key);
  },
});
delete proxy.name;
console.log("name" in proxy); // true

// prevent property from being deleted
