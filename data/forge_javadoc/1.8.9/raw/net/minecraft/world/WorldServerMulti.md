---
title: "WorldServerMulti"
description: "Syncs all changes to disk and wait for completion."
package: "net/minecraft/world"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/world/WorldServerMulti.html"
sourceType: javadoc
---

# WorldServerMulti

## Class signature

```java
public class WorldServerMulti extends WorldServer
```

## Constructors

- `public WorldServerMulti( MinecraftServer server, ISaveHandler saveHandlerIn, int dimensionId, WorldServer delegate, Profiler profilerIn)`

## Methods

- `protected void saveLevel() throws MinecraftException`
- `public World init()`
- `public void flush()`

## Description

Syncs all changes to disk and wait for completion.
