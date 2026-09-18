# FMLConstructionEvent

## Class signature

```java
public class FMLConstructionEvent extends FMLStateEvent
```

## Constructors

- `public FMLConstructionEvent(java.lang.Object... eventData)`

## Methods

- `public ModClassLoader getModClassLoader()`
- `public LoaderState.ModState getModState()`
- `public ASMDataTable getASMHarvestedData()`
- `public com.google.common.collect.ListMultimap<java.lang.String,java.lang.String> getReverseDependencies()`

## Description

An internal FML event used to signal the construction of mods. Should not be used by mods.