# Shell Tests

## Simple Echo
```bash
echo "Hello World"
```

## Exit Codes
```sh
# Should pass (exit 0)
true
```

## Variables
<!-- share-code-between-examples -->

```bash
MY_VAR="hello"
```

```bash
if [ "$MY_VAR" != "hello" ]; then
    exit 1
fi
```

## Bash Arrays
```bash
# Bash arrays are 0-indexed
arr=(a b c)
if [[ ${arr[0]} != "a" ]]; then
    echo "Expected 'a', got '${arr[0]}'"
    exit 1
fi
```

## Failure
```bash
false
```

