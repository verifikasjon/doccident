# Configuration Tests

## Python Arguments
<!-- args: -V -->
```python
import sys
# Python -V prints version to stdout/stderr depending on version, usually stdout
print("Done")
```

## Shell Arguments
<!-- args: arg1 arg2 -->
<!-- id: shell-args-code -->
```bash
echo "Arg 1: $1"
echo "Arg 2: $2"
```

<!-- output: shell-args-code -->
```text
Arg 1: arg1
Arg 2: arg2
```

## Environment Variables
<!-- env: MY_ENV_VAR=tested -->
<!-- id: env-vars-code -->
```bash
echo "Env: $MY_ENV_VAR"
```

<!-- output: env-vars-code -->
```text
Env: tested
```

## C Compiler Flags
<!-- args: -DTEST_MACRO -->
<!-- id: c-flags-code -->
```c
#include <stdio.h>
#ifdef TEST_MACRO
void test() { printf("Macro Defined\n"); }
#else
void test() { printf("Macro Missing\n"); }
#endif
int main() { test(); return 0; }
```

<!-- output: c-flags-code -->
```text
Macro Defined
```
