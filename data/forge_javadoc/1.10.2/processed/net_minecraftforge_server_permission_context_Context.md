# Context

**Inheritance:** java.lang.Object → net.minecraftforge.server.permission.context.Context

## Class signature

```java
public class Context extends java.lang.Object implements IContext
```

## Constructors

- `Context()`

## Methods

- `protected boolean covers(ContextKey<?> key)`
- `<T> T get(ContextKey<T> key)`
- `EntityPlayer getPlayer()`
- `World getWorld()` — World from where permission is requested.
- `boolean has(ContextKey<?> key)`
- `<T> Context set(ContextKey<T> key, T obj)` — Sets Context object