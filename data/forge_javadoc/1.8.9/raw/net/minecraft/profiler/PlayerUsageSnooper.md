---
title: "PlayerUsageSnooper"
description: "Returns the saved value of System#currentTimeMillis when the game started"
package: "net/minecraft/profiler"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/profiler/PlayerUsageSnooper.html"
sourceType: javadoc
---

# PlayerUsageSnooper

## Class signature

```java
public class PlayerUsageSnooper extends java.lang.Object
```

## Constructors

- `public PlayerUsageSnooper(java.lang.String p_i1563_1_, IPlayerUsage playerStatCollector, long startTime)`

## Methods

- `public void startSnooper()`
- `public void addMemoryStatsToSnooper()`
- `public void addClientStat(java.lang.String p_152768_1_, java.lang.Object p_152768_2_)`
- `public void addStatToSnooper(java.lang.String p_152767_1_, java.lang.Object p_152767_2_)`
- `public java.util.Map<java.lang.String,java.lang.String> getCurrentStats()`
- `public boolean isSnooperRunning()`
- `public void stopSnooper()`
- `public java.lang.String getUniqueID()`
- `public long getMinecraftStartTimeMillis()`

## Description

Returns the saved value of System#currentTimeMillis when the game started
