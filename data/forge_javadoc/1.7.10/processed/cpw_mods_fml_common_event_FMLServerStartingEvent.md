# FMLServerStartingEvent

**Inheritance:** java.lang.Object → cpw.mods.fml.common.event.FMLEvent → cpw.mods.fml.common.event.FMLStateEvent → cpw.mods.fml.common.event.FMLServerStartingEvent

## Class signature

```java
public class FMLServerStartingEvent extends FMLStateEvent
```

## Constructors

- `FMLServerStartingEvent(java.lang.Object... data)`

## Methods

- `LoaderState.ModState getModState()`
- `MinecraftServer getServer()`
- `void registerServerCommand(ICommand command)`