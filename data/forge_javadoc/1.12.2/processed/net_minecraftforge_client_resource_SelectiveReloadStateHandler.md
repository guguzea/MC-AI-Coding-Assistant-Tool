# SelectiveReloadStateHandler

## Class signature

```java
public enum SelectiveReloadStateHandler extends java.lang.Enum< SelectiveReloadStateHandler >
```

## Methods

- `public static SelectiveReloadStateHandler [] values()`
- `public static SelectiveReloadStateHandler valueOf(java.lang.String name)`
- `public void beginReload(java.util.function.Predicate< IResourceType > resourcePredicate)`
- `public java.util.function.Predicate< IResourceType > get()`
- `public void endReload()`

## Description

Handles reload parameters for selective loaders.