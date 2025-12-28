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

## Zsh Specific
```zsh
# Zsh arrays are 1-indexed
emulate zsh
arr=(a b c)
if [[ ${arr[1]} != "a" ]]; then
    echo "Expected 'a', got '${arr[1]}'"
    exit 1
fi
```

## Failure
```bash
false
```

