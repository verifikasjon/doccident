# Advanced Python Tests

## Standard Library Imports
```python
import json
import math

data = {"key": "value"}
assert json.dumps(data) == '{"key": "value"}'
assert math.sqrt(16) == 4
```

## Classes and Functions
<!-- share-code-between-examples -->

```python
class Calculator:
    def add(self, a, b):
        return a + b

def multiply(a, b):
    return a * b
```

```python
calc = Calculator()
assert calc.add(5, 3) == 8
assert multiply(4, 2) == 8
```

## Complex Data Structures
```python
numbers = [1, 2, 3, 4, 5]
squared = [x**2 for x in numbers]
assert squared == [1, 4, 9, 16, 25]

matrix = [[1, 2], [3, 4]]
flattened = [x for row in matrix for x in row]
assert flattened == [1, 2, 3, 4]
```

## Multiline Statements
```python
total = (1 + 2 +
         3 + 4)
assert total == 10
```

## Exception Handling
```python
try:
    x = 1 / 0
except ZeroDivisionError:
    pass
else:
    assert False, "Should have raised ZeroDivisionError"
```

