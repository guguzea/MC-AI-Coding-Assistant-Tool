---
title: "PlayerUsageSnooper"
description: "public class PlayerUsageSnooper extends java.lang.Object"
package: "net/minecraft/profiler"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/profiler/PlayerUsageSnooper.html"
sourceType: javadoc
---

# PlayerUsageSnooper

**Inheritance:** java.lang.Object → net.minecraft.profiler.PlayerUsageSnooper

## Class signature

```java
public class PlayerUsageSnooper extends java.lang.Object
```

## Constructors

- `PlayerUsageSnooper(java.lang.String p_i1563_1_, IPlayerUsage playerStatCollector, long startTime)`

## Methods

- `void addClientStat(java.lang.String p_152768_1_, java.lang.Object p_152768_2_)`
- `void addMemoryStatsToSnooper()`
- `void addStatToSnooper(java.lang.String p_152767_1_, java.lang.Object p_152767_2_)`
- `java.util.Map<java.lang.String, java.lang.String> getCurrentStats()`
- `long getMinecraftStartTimeMillis()` — Returns the saved value of System#currentTimeMillis when the game started
- `java.lang.String getUniqueID()`
- `boolean isSnooperRunning()`
- `void startSnooper()` — Note issuing start multiple times is not an error.
- `void stopSnooper()`
