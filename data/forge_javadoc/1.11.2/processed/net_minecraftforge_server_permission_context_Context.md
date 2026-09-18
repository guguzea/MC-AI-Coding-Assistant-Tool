# Context

## Class signature

```java
public class Context extends java.lang.Object implements IContext
```

## Constructors

- `public Context()`

## Methods

- `@Nullable public World getWorld()`
- `@Nullable public EntityPlayer getPlayer()`
- `@Nullable public <T> T get( ContextKey <T> key)`
- `public boolean has( ContextKey <?> key)`
- `public <T> Context set( ContextKey <T> key, @Nullable T obj)`
- `protected boolean covers( ContextKey <?> key)`

## Description

World from where permission is requested.