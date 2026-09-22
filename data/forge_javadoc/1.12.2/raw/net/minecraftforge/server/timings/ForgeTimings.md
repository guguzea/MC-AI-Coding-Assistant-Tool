---
title: "ForgeTimings"
description: "public class ForgeTimings<T> extends java.lang.Object"
package: "net/minecraftforge/server/timings"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/server/timings/ForgeTimings.html"
sourceType: javadoc
---

# ForgeTimings

**Inheritance:** java.lang.Object → net.minecraftforge.server.timings.ForgeTimings<T>

## Class signature

```java
public class ForgeTimings<T> extends java.lang.Object
```

## Constructors

- `ForgeTimings(T object, int[] rawTimingData)`

## Methods

- `double getAverageTimings()` — Averages the raw timings data collected
- `java.lang.ref.WeakReference<T> getObject()` — Retrieves the object that the timings are for
- `@Deprecated int[] getRawTimingData()` — Deprecated. Added for compatibility, remove in 1.13
