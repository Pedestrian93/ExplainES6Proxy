const a = { name: "san" };

const proxy = new Proxy(a, {
  has(target, key) {
    if (key === "name") {
      return false;
    }
    return Reflect.has(target, key);
  },
});

console.log("name" in proxy); // false
