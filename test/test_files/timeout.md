# Timeout Test

This file contains a snippet that sleeps for 2 seconds. We will run it with a 1 second timeout to verify it fails.

```javascript
const start = Date.now();
while (Date.now() - start < 2000) {
    // Busy wait
}
```

