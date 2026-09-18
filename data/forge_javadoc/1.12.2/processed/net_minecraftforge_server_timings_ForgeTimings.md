# ForgeTimings

## Class signature

```java
public class ForgeTimings<T> extends java.lang.Object
```

## Constructors

- `public ForgeTimings( T object, int[] rawTimingData)`

## Methods

- `public java.lang.ref.WeakReference< T > getObject()`
- `public double getAverageTimings()`
- `public int[] getRawTimingData()`

## Description

ForgeTimings aggregates timings data collected by TimeTracker for an Object and performs operations for interpretation of the data.