# FMLConstructionEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.event.FMLEvent → net.minecraftforge.fml.common.event.FMLStateEvent → net.minecraftforge.fml.common.event.FMLConstructionEvent

## Class signature

```java
public class FMLConstructionEvent extends FMLStateEvent
```

## Constructors

- `FMLConstructionEvent(java.lang.Object... eventData)`

## Methods

- `ASMDataTable getASMHarvestedData()`
- `ModClassLoader getModClassLoader()`
- `LoaderState.ModState getModState()` — The current state of the mod
- `com.google.common.collect.ListMultimap<java.lang.String, java.lang.String> getReverseDependencies()`