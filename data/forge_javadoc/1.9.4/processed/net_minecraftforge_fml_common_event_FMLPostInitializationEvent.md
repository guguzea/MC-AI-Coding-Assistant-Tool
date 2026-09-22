# FMLPostInitializationEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.event.FMLEvent → net.minecraftforge.fml.common.event.FMLStateEvent → net.minecraftforge.fml.common.event.FMLPostInitializationEvent

## Class signature

```java
public class FMLPostInitializationEvent extends FMLStateEvent
```

## Constructors

- `FMLPostInitializationEvent(java.lang.Object... data)`

## Methods

- `com.google.common.base.Optional<?> buildSoftDependProxy(java.lang.String modId, java.lang.String className, java.lang.Object... arguments)` — Build an object depending on if a specific target mod is loaded or not.
- `LoaderState.ModState getModState()` — The current state of the mod