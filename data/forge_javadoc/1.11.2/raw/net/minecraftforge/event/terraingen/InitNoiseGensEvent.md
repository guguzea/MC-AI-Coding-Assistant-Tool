---
title: "InitNoiseGensEvent"
description: "public class InitNoiseGensEvent<T extends InitNoiseGensEvent.Context> extends WorldEvent"
package: "net/minecraftforge/event/terraingen"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/event/terraingen/InitNoiseGensEvent.html"
sourceType: javadoc
---

# InitNoiseGensEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.world.WorldEvent → net.minecraftforge.event.terraingen.InitNoiseGensEvent<T>

## Class signature

```java
public class InitNoiseGensEvent<T extends InitNoiseGensEvent.Context> extends WorldEvent
```

## Constructors

- `InitNoiseGensEvent(World world, java.util.Random rand, T original)`

## Methods

- `T getNewValues()`
- `T getOriginal()`
- `java.util.Random getRandom()`
