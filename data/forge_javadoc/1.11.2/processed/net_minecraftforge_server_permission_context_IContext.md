# IContext

## Class signature

```java
public interface IContext
```

## Methods

- `<T> T get(ContextKey<T> key)`
- `EntityPlayer getPlayer()`
- `World getWorld()` — World from where permission is requested.
- `boolean has(ContextKey<?> key)`