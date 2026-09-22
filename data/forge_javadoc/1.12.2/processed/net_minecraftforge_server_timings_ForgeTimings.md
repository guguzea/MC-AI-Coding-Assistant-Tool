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