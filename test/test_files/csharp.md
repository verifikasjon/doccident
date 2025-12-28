# C# Tests

## Simple Snippet (Auto-wrapped)
```csharp
Console.WriteLine("Hello C#");
```

## Full Class
```csharp
using System;

public class MyTest {
    public static void Main(string[] args) {
        Console.WriteLine("Hello from MyTest class");
        int sum = 2 + 3;
        if (sum != 5) {
            throw new Exception("Math broken");
        }
    }
}
```

## Failure
```csharp
using System;
throw new Exception("This failed");
```

## Compilation Error
```csharp
using System;
public class Broken {
    public static void Main(string[] args) {
        int x = "string"; // Type mismatch
    }
}
```

