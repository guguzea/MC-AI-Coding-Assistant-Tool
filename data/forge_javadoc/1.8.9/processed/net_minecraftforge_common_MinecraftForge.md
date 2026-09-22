# MinecraftForge

**Inheritance:** java.lang.Object → net.minecraftforge.common.MinecraftForge

## Class signature

```java
public class MinecraftForge extends java.lang.Object
```

## Constructors

- `MinecraftForge()`

## Methods

- `static void addGrassSeed(ItemStack seed, int weight)` — Register a new seed to be dropped when breaking tall grass.
- `static void initialize()` — Method invoked by FML before any other mods are loaded.

## Fields

- `static EventBus EVENT_BUS` — The core Forge EventBusses, all events for Forge will be fired on these, you should use this to register all your listeners.
- `static java.lang.String MC_VERSION`
- `static EventBus ORE_GEN_BUS`
- `static EventBus TERRAIN_GEN_BUS`