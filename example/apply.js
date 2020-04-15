// handler.apply() 方法用于拦截函数的调用。

function sum(a, b) {
  return a + b;
}

const proxy = new Proxy(sum, {
  apply(target, thisArg, argumentsList) {},
});

console.log(proxy(3, 4));
// TODO change + to *
