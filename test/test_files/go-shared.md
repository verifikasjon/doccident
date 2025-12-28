# Go Shared State Tests
<!-- share-code-between-examples -->

## Imports and Types
```go
import "strings"

type Person struct {
    Name string
}
```

## Functions
```go
func (p Person) Greet() string {
    return "Hello, " + strings.ToUpper(p.Name)
}
```

## Execution
```go
p := Person{Name: "world"}
fmt.Println(p.Greet())
```

