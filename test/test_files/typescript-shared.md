# TypeScript Shared State Tests
<!-- share-code-between-examples -->

## Interface Definition
```ts
interface Person {
    name: string;
}

let p: Person;
```

## Usage
```ts
p = { name: "Doccident" };
if (p.name !== "Doccident") {
    throw new Error("Name mismatch");
}
```

