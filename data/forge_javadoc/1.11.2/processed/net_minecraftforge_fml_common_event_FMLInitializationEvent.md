# FMLInitializationEvent

## Class signature

```java
public class FMLInitializationEvent extends FMLStateEvent
```

## Constructors

- `public FMLInitializationEvent(java.lang.Object... data)`

## Methods

- `public LoaderState.ModState getModState()`

## Description

Called after FMLPreInitializationEvent and before FMLPostInitializationEvent during mod startup. This is the second of three commonly called events during mod initialization. Recommended activities: R