# Output Verification Tests

## ID and Output
<!-- id: hello-js -->
```js
console.log("Hello Output");
```

<!-- output: hello-js -->
```text
Hello Output
```

## Shared State Output
<!-- share-code-between-examples -->

<!-- id: shared-setup -->
```js
var x = 10;
```

<!-- id: shared-use -->
```js
console.log(x * 2);
```

<!-- output: shared-use -->
```text
20
```

## Failure Case (Incorrect Output)
<!-- id: fail-snippet -->
```js
console.log("Actual");
```

<!-- output: fail-snippet -->
```text
Expected
```

