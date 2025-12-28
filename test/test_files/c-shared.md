# C Shared State Tests
<!-- share-code-between-examples -->

## Includes and Structs
```c
#include <stdlib.h>

typedef struct {
    int x;
    int y;
} Point;
```

## Functions
```c
int add(int a, int b) {
    return a + b;
}
```

## Usage
```c
Point p;
p.x = 10;
p.y = 20;
int sum = add(p.x, p.y);

if (sum != 30) {
    exit(1);
}
printf("Success: %d\n", sum);
```

