# Rust Shared State Tests
<!-- share-code-between-examples -->

## Struct Definition
```rust
#[derive(Debug)]
struct Point {
    x: i32,
    y: i32
}
```

## Function Definition
```rust
fn add_points(p1: Point, p2: Point) -> Point {
    Point { x: p1.x + p2.x, y: p1.y + p2.y }
}
```

## Usage
```rust
let p1 = Point { x: 1, y: 2 };
let p2 = Point { x: 3, y: 4 };
let p3 = add_points(p1, p2);

assert_eq!(p3.x, 4);
assert_eq!(p3.y, 6);
println!("Success: {:?}", p3);
```

