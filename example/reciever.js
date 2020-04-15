const proxy = new Proxy(
  { name: "san" },
  {
    set(target, key, value, reciever) {
      console.log(target, key, value, reciever);
      return Reflect.get(target, key, value, reciever);
    },
  }
);

// proxy.a = 1;

const sonObj = Object.create(proxy);
sonObj.name = 9;
