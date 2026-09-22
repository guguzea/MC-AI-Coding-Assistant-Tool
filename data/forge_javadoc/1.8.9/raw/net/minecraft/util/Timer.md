---
title: "Timer"
description: "public class Timer extends java.lang.Object"
package: "net/minecraft/util"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/util/Timer.html"
sourceType: javadoc
---

# Timer

**Inheritance:** java.lang.Object → net.minecraft.util.Timer

## Class signature

```java
public class Timer extends java.lang.Object
```

## Constructors

- `Timer(float p_i1018_1_)`

## Methods

- `void updateTimer()` — Updates all fields of the Timer using the current time

## Fields

- `float elapsedPartialTicks` — How much time has elapsed since the last tick, in ticks (range: 0.0 - 1.0).
- `int elapsedTicks` — How many full ticks have turned over since the last call to updateTimer(), capped at 10.
- `float renderPartialTicks` — How much time has elapsed since the last tick, in ticks, for use by display rendering routines (range: 0.0 - 1.0).
- `float timerSpeed` — A multiplier to make the timer (and therefore the game) go faster or slower. 0.5 makes the game run at half- speed.
