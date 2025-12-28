emulate zsh
arr=(a b c)
if [[ ${arr[1]} != "a" ]]; then
    echo "Expected 'a', got '${arr[1]}'"
    exit 1
fi
echo "Zsh success"

