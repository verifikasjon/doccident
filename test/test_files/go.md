# Go Tests

## Simple Snippet (Auto-wrapped)
```go
fmt.Println("Hello Go")
```

## Full Program
```go
package main

import (
	"fmt"
)

func main() {
	x := 10
	if x != 10 {
		panic("x should be 10")
	}
	fmt.Println("Success")
}
```

## Failure
```go
package main

func main() {
	panic("Fail")
}
```

