---
title: "TimeTracker"
description: "A class to assist in the collection of data to measure the update times of ticking objects {currently Tile Entities and Entities}"
package: "net/minecraftforge/server/timings"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/server/timings/TimeTracker.html"
sourceType: javadoc
---

# TimeTracker

## Class signature

```java
public class TimeTracker<T> extends java.lang.Object
```

## Constructors

- `public TimeTracker()`

## Methods

- `public <any> getTimingData()`
- `public void reset()`
- `public void trackEnd( T tracking)`
- `public void enable(int duration)`
- `public void trackStart( T toTrack)`

## Description

A class to assist in the collection of data to measure the update times of ticking objects {currently Tile Entities and Entities}
