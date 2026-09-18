# ActionResult

## Class signature

```java
public class ActionResult<T> extends java.lang.Object
```

## Constructors

- `public ActionResult( EnumActionResult typeIn, T resultIn)`

## Methods

- `public EnumActionResult getType()`
- `public T getResult()`
- `public static <T> ActionResult <T> newResult( EnumActionResult result, T value)`