---
title: "Snooper"
description: "public class Snooper extends java.lang.Object"
package: "net/minecraft/profiler"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/profiler/Snooper.html"
sourceType: javadoc
---

# Snooper

**Inheritance:** java.lang.Object → net.minecraft.profiler.Snooper

## Class signature

```java
public class Snooper extends java.lang.Object
```

## Constructors

- `Snooper(java.lang.String side, ISnooperInfo playerStatCollector, long startTime)`

## Methods

- `void addClientStat(java.lang.String statName, java.lang.Object statValue)`
- `void addMemoryStatsToSnooper()`
- `void addStatToSnooper(java.lang.String statName, java.lang.Object statValue)`
- `java.util.Map<java.lang.String, java.lang.String> getCurrentStats()`
- `long getMinecraftStartTimeMillis()`
- `java.lang.String getUniqueID()`
- `boolean isSnooperRunning()`
- `void startSnooper()`
- `void stopSnooper()`
