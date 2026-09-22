# FMLServerStartingEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.event.FMLEvent → net.minecraftforge.fml.common.event.FMLStateEvent → net.minecraftforge.fml.common.event.FMLServerStartingEvent

## Class signature

```java
public class FMLServerStartingEvent extends FMLStateEvent
```

## Constructors

- `FMLServerStartingEvent(java.lang.Object... data)`

## Methods

- `LoaderState.ModState getModState()` — The current state of the mod
- `MinecraftServer getServer()`
- `void registerServerCommand(ICommand command)`