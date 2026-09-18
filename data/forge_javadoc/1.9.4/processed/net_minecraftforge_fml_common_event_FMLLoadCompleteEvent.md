# FMLLoadCompleteEvent

## Class signature

```java
public class FMLLoadCompleteEvent extends FMLStateEvent
```

## Constructors

- `public FMLLoadCompleteEvent(java.lang.Object... data)`

## Methods

- `public LoaderState.ModState getModState()`

## Description

This is a mostly internal event fired to mod containers that indicates that loading is complete. Mods should not in general override or otherwise attempt to implement this event.