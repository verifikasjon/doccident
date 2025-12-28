# Output Matching Tests

## Exact Match (Default)
<!-- id: exact-js -->
```js
console.log("Exact");
```

<!-- output: exact-js -->
```text
Exact
```

## Ignore Whitespace
<!-- id: fuzzy-js -->
```js
console.log("  A   B\nC  ");
```

<!-- output: fuzzy-js ignore-whitespace -->
```text
A B C
```

## Regex Match
<!-- id: regex-js -->
```js
console.log("Timestamp: " + Date.now());
```

<!-- output: regex-js match:regex -->
```text
^Timestamp: \d+$
```

## Failure Case (Regex)
<!-- id: regex-fail -->
```js
console.log("Not a timestamp");
```

<!-- output: regex-fail match:regex -->
```text
^Timestamp: \d+$
```

