# Rust Tests

## Simple Snippet (Auto-wrapped)
```rust
println!("Hello Rust");
let x = 5;
assert_eq!(x, 5);
```

## Full Program
```rust
fn add(a: i32, b: i32) -> i32 {
    a + b
}

fn main() {
    let sum = add(5, 10);
    assert_eq!(sum, 15);
}
```

## Failure
```rust
fn main() {
    panic!("This should fail");
}
```

## Compilation Error
```rust
let x: i32 = "string"; // Type mismatch
```

