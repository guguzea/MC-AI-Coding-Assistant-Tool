# LoaderState

## Class signature

```java
public enum LoaderState extends java.lang.Enum< LoaderState >
```

## Methods

- `public static LoaderState [] values()`
- `public static LoaderState valueOf(java.lang.String name)`
- `public LoaderState transition(boolean errored)`
- `public boolean hasEvent()`
- `public FMLStateEvent getEvent(java.lang.Object... eventData)`
- `public LoaderState requiredState()`

## Description

The state enum used to help track state progression for the loader