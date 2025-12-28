# Java Tests

## Simple Snippet (Auto-wrapped)
```java
System.out.println("Hello Java");
```

## Full Class
```java
public class MyTest {
    public static void main(String[] args) {
        System.out.println("Hello from MyTest class");
        int sum = 2 + 3;
        if (sum != 5) {
            throw new RuntimeException("Math broken");
        }
    }
}
```

## Advanced Features (Lambdas and Streams)
```java
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class AdvancedTest {
    public static void main(String[] args) {
        List<String> names = Arrays.asList("a", "b", "c");
        List<String> upper = names.stream()
            .map(String::toUpperCase)
            .collect(Collectors.toList());
            
        if (!upper.get(0).equals("A")) {
            throw new RuntimeException("Stream failed");
        }
        System.out.println("Streams working");
    }
}
```

## Generics and Inner Classes
```java
public class GenericTest {
    static class Box<T> {
        private T t;
        public void set(T t) { this.t = t; }
        public T get() { return t; }
    }

    public static void main(String[] args) {
        Box<Integer> integerBox = new Box<Integer>();
        integerBox.set(10);
        if (integerBox.get() != 10) throw new RuntimeException("Generics failed");
        System.out.println("Generics working");
    }
}
```

## Failure
```java
throw new RuntimeException("This failed");
```

## Compilation Error
```java
public class Broken {
    public static void main(String[] args) {
        int x = "string"; // Type mismatch
    }
}
```
