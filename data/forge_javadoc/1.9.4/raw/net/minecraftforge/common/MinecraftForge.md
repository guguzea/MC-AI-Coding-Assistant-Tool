---
title: "MinecraftForge"
description: "public class MinecraftForge extends java.lang.Object"
package: "net/minecraftforge/common"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/common/MinecraftForge.html"
sourceType: javadoc
---

# MinecraftForge

**Inheritance:** java.lang.Object → net.minecraftforge.common.MinecraftForge

## Class signature

```java
public class MinecraftForge extends java.lang.Object
```

## Constructors

- `MinecraftForge()`

## Methods

- `static void addGrassSeed(net.minecraftforge.common.ForgeHooks.SeedEntry seed)`
- `static void addGrassSeed(ItemStack seed, int weight)` — Register a new seed to be dropped when breaking tall grass.
- `static void initialize()` — Method invoked by FML before any other mods are loaded.
- `static void preloadCrashClasses(ASMDataTable table, java.lang.String modID, java.util.Set<java.lang.String> classes)`

## Fields

- `static EventBus EVENT_BUS` — The core Forge EventBusses, all events for Forge will be fired on these, you should use this to register all your listeners.
- `static java.lang.String MC_VERSION`
- `static EventBus ORE_GEN_BUS`
- `static EventBus TERRAIN_GEN_BUS`
