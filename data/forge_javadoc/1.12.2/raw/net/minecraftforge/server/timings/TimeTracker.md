---
title: "TimeTracker"
description: "public class TimeTracker<T> extends java.lang.Object"
package: "net/minecraftforge/server/timings"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/server/timings/TimeTracker.html"
sourceType: javadoc
---

# TimeTracker

**Inheritance:** java.lang.Object → net.minecraftforge.server.timings.TimeTracker<T>

## Class signature

```java
public class TimeTracker<T> extends java.lang.Object
```

## Constructors

- `TimeTracker()`

## Methods

- `void enable(int duration)` — Starts recording tracking data for the given duration in seconds
- `<any> getTimingData()` — Returns the timings data recorded by the tracker
- `void reset()` — Resets the tracker (clears timings and stops any in-progress timings)
- `void trackEnd(T tracking)` — Ends the timing of the currently tracking object
- `void trackStart(T toTrack)` — Starts timing of the provided object

## Fields

- `static TimeTracker<Entity> ENTITY_UPDATE` — A tracker for timing entity updates
- `static TimeTracker<TileEntity> TILE_ENTITY_UPDATE` — A tracker for timing tile entity update
