# Proxy 与 Reflection

<a name="ZfB0Z"></a>
### 前言
Proxy 用于修改某些操作的默认行为，等同于在语言层面做出修改，所以属于一种“元编程”（meta programming），即对编程语言进行编程。<br />

> **一般代码的操作对象是数据，**
> **元编程操作的对象是其他代码**



```javascript
const a = {};
a.b = 1;// 更改语言的默认行为
```

<br />Proxy 可以理解成，在目标对象之前架设一层“拦截”，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写。Proxy 这个词的原意是代理，用在这里表示由它来“代理”某些操作，可以译为“代理器”。<br />

<a name="KCdRd"></a>
## Proxy

<br />使用 `new Proxy()` 会创建一个 proxy 对象，该对象会虚拟化目标对象，所以实际上可以认为它们是同一个对象。<br />

```javascript
const proxy = new Proxy(target, handler);
```

<br />`handler` 为一个有一批特殊属性的占位符对象，包含若干 `Proxy`的 `trap` (捕获器)，每一个 trap 都会覆盖对象的默认行为，例如 get， set， has。<br />
<br />

<a name="8cLSi"></a>
### 创建一个简单的 Proxy


```javascript
let target = {};
let proxy = new Proxy(target, {});
proxy.name = 'proxy';
console.log(target.name);  // 'proxy'

target.name = 'target';
console.log(proxy.name);   // 'target'
```

<br />这里 proxy 代理所有的操作直接给了目标对象，当设置 name 属性的时候，proxy 不会存储该属性，而是直接地转给了目标对象，而且 proxy 的属性会一直指向目标对象的属性，从引用上来说这两个对象是完全相同的。<br />

<a name="1hKfw"></a>
### 用 set Trap 验证属性合法性

<br />如果我们想创建一个属性值必须是 Number 类型的对象，就要在每次设置属性的时候去验证，如果不是 Number 就抛出异常。<br />

```javascript
const a = { c: 33 };
const handler = {
  set(target, key, value, reciever) {
    if (isNaN(value)) {
      throw new Error('Property must be a number');
    } else {
      Reflect.set(...arguments);
    }
  },
};
const p = new Proxy(a, handler);
p.a = 'xx'; // throw error
```

<br />注意： set 接收的最后一个参数是 `reciever` ，一般情况下都是 proxy 本身，但是在非直接调用的情况下，比如 `a.b = 2` , a 的原型链上才有 b 属性，这时候 `reciever` 所指的就不是 proxy， 而是对象 a。<br />

<a name="Towtu"></a>
### 用 has Trap 隐藏对象属性

<br />关键字 in 可以检测对象本身或者原型上是否有某个属性，利用 has Trap 我们可以劫持 in 判断。<br />

```javascript
const a = { name: 'san' };
const handler = {
  has(target, key) {
    if (key === 'name') {
      return false;
    }
    return Reflect.has(target, key);
  },
};

const p = new Proxy(a, handler);
console.log('name' in p); // false
```


<a name="Xm9xD"></a>
### 用 deleteProperty Trap 防止误删对象属性


```javascript
const a = { name: 'san' };
const handler = {
  deleteProperty(target, key) {
    if (key === 'name') {
      return false;
    }
    return Reflect.deleteProperty(target, key);
  },
};

const p = new Proxy(a, handler);
delete p.name;
console.log('name' in p); // true
```


<a name="7i0K8"></a>
### 原型代理

<br />setPrototypeOf 和 getPrototypeOf 陷阱可以让我们去改变关于对象原型的操作。然而也存在一些限制条件：首先， getPrototypeOf 必须返回一个 Object 或者 null；其次，如果 setPrototypeOf() 没有成功必须返回 false，当返回 false 时，Object.setPrototypeOf() 会抛错，返回任何其他值都会被视作操作成功。<br />

<a name="GlKAj"></a>
#### 两个方法在代理和对象上的区别：
首先，`Object.getPrototypeOf()`，`Object.setPrototypeOf()` 是更高层级的用户操作，而 Proxy 的操作实际上更底层，它是 `[[GetPrototypeOf]]` 的一层包装，对象上的操作

```javascript
const b = {x: 1}
const a = Object.create(b);
const aproto = Reflect.getPrototypeOf(a)

console.log(a) // {}
console.log(aproto); // {x: 1}
```

<br />

```javascript
Reflect.getPrototypeOf(Object.create(null)) // null
Reflect.getPrototypeOf(1) // throw TypeError
Object.getPrototypeOf(1) // Number
```


```javascript
const a = { x: 1 };
const b = {};
console.log(Reflect.setPrototypeOf(b, a)); // true
console.log(Reflect.getPrototypeOf(b));    // {x: 1}
Reflect.setPrototypeOf(b, 1) // throw TypeError
```

<br />

<a name="J5J19"></a>
### Reciver 参数的理解
```javascript
const proxy = new Proxy(
  { name: 'san' },
  {
    set(target, key, value, reciever) {
      console.log(target, key, value, reciever); // {name: 'san'} name 9 {}
      return Reflect.get(target, key, value, reciever);
    },
  },
);
const sonObj = Object.create(proxy);
console.log(Object.getPrototypeOf(sonObj)) // {name: 'san'}
sonObj.name = 9;
```
<a name="3j7Hn"></a>
## Reflect
Reflect 是一个全局对象，包含若干方法。
<a name="Fjbla"></a>
### 设计目的

- 用于处理对象的底层方法。
- 修改 `Object` 方法的返回结果，比如，`Object.defineProperty(obj, name, desc)`在无法定义属性时，会抛出一个错误，而`Reflect.defineProperty(obj, name, desc)`则会返回`false`。
- 让`Object`操作都变成函数行为。某些`Object`操作是命令式，比如`name in obj`和`delete obj[name]`，而`Reflect.has(obj, name)`和`Reflect.deleteProperty(obj, name)`让它们变成了函数行为。
- `Reflect`对象的方法与`Proxy`对象的方法一一对应，只要是`Proxy`对象的方法，就能在`Reflect`对象上找到对应的方法。这就让`Proxy`对象可以方便地调用对应的`Reflect`方法，完成默认行为，作为修改行为的基础。也就是说，不管`Proxy`怎么修改默认行为，你总可以在`Reflect`上获取默认行为。



| 陷阱函数 | 被重写的行为 | 默认行为 |
| --- | --- | --- |
| get | 读取一个属性的值 | Reflect.get() |
| set | 写入一个属性 | Reflect.set() |
| has | in 运算符 | Reflect.has() |
| deleteProperty | delete 运算符 | Reflect.deleteProperty() |
| getPrototypeOf | Object.getPrototypeOf() | Reflect.getPrototypeOf() |
| setPrototypeOf | Object.setPrototypeOf() | Reflect.setPrototypeOf() |
| isExtensible | Object.isExtensible() | Reflect.isExtensible() |
| preventExtensions | Object.preventExtensions() | Reflect.preventExtensions() |
| getOwnPropertyDescriptor | Object.getOwnPropertyDescriptor() | Reflect.getOwnPropertyDescriptor() |
| defineProperty | Object.defineProperty() | Reflect.defineProperty |
| ownKeys | Object.keys、Object.getOwnPropertyNames() 与 Object.getOwnPropertySymbols() | Reflect.ownKeys() |
| apply | 调用一个函数 | Reflect.apply() |
| construct | 使用 new 调用一个函数 | Reflect.construct() |


<br />
<br />

