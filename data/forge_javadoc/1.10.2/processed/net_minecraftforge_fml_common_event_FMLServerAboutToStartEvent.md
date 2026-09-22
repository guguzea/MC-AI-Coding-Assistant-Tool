# FMLServerAboutToStartEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.event.FMLEvent → net.minecraftforge.fml.common.event.FMLStateEvent → net.minecraftforge.fml.common.event.FMLServerAboutToStartEvent

## Class signature

```java
public class FMLServerAboutToStartEvent extends FMLStateEvent
```

## Constructors

- `FMLServerAboutToStartEvent(java.lang.Object... data)`

## Methods

- `LoaderState.ModState getModState()` — The current state of the mod
- `MinecraftServer getServer()`