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
