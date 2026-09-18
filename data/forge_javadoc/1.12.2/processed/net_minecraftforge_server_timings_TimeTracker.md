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