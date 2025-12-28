# C Tests

## Simple Snippet (Auto-wrapped)
```c
printf("Hello C\n");
```

## Full Program
```c
#include <stdio.h>

int add(int a, int b) {
    return a + b;
}

int main() {
    int res = add(5, 7);
    if (res != 12) {
        return 1;
    }
    printf("Success\n");
    return 0;
}
```

## Failure
```c
int main() {
    return 1;
}
```

## Compilation Error
```c
int main() {
    int x = "string"; // Type mismatch warning/error depending on flags, but let's break syntax
    return 0;
}
```

