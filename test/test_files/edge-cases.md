# Edge Cases

```js
// Empty snippet
```

```javascript
// Valid JavaScript
const x = 10;
if (x !== 10) throw new Error("x should be 10");
```

```ts
// Valid TypeScript with types
interface Point {
  x: number;
  y: number;
}
const p: Point = { x: 0, y: 0 };
```

<!-- skip-example -->
```js
// This should be skipped
throw new Error("This should have been skipped");
```

<!-- share-code-between-examples -->
```js
const shared = "shared value";
```

```js
// Should have access to shared
if (typeof shared === 'undefined') throw new Error("shared variable not found");
if (shared !== "shared value") throw new Error("shared variable has wrong value");
```

