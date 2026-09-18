# IContext

## Class signature

```java
public interface IContext
```

## Methods

- `@Nullable World getWorld()`
- `@Nullable EntityPlayer getPlayer()`
- `@Nullable <T> T get( ContextKey <T> key)`
- `boolean has( ContextKey <?> key)`

## Description

Use BlockPosContext or PlayerContext when possible