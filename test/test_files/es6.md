Time for es6 support

so examples like this

```es6
const a = 5;

const b = _ => 'foo';

class Foo {
  constructor (bar, baz) {
    this.bar = bar;
    this.baz = baz;
  }
}
```

But nobody writes examples using that syntax except for me


So we should always use es6?

```js
const maybe = _ => 'indeed';

const [a, b] = [1, 2];
```

## Async/Await
```js
async function fetchData() {
    return "data";
}

(async () => {
    const data = await fetchData();
    if (data !== "data") throw new Error("Async failed");
})();
```

## Generators
```js
function* idMaker() {
    let index = 0;
    while (true)
        yield index++;
}

const gen = idMaker();
if (gen.next().value !== 0) throw new Error("Generator failed");
if (gen.next().value !== 1) throw new Error("Generator failed");
```

## Maps and Sets
```js
const map = new Map();
map.set('key', 'value');
if (map.get('key') !== 'value') throw new Error("Map failed");

const set = new Set([1, 2, 2, 3]);
if (set.size !== 3) throw new Error("Set failed");
```
