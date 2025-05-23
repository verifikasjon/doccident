# Fail with Line Numbers

```js
// This code will fail with a nice stack trace
function willFail() {
  const obj = null;
  // This should throw a TypeError with line number information
  obj.someProperty = 'value';
}
willFail();
``` 