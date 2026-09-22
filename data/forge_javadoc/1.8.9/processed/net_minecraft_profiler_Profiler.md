# Profiler

**Inheritance:** java.lang.Object → net.minecraft.profiler.Profiler

## Class signature

```java
public class Profiler extends java.lang.Object
```

## Constructors

- `Profiler()`

## Methods

- `void clearProfiling()` — Clear profiling.
- `void endSection()` — End section
- `void endStartSection(java.lang.String name)` — End current section and start a new section
- `java.lang.String getNameOfLastSection()`
- `java.util.List<Profiler.Result> getProfilingData(java.lang.String p_76321_1_)`
- `void startSection(java.lang.String name)` — Start section

## Fields

- `boolean profilingEnabled` — Flag profiling enabled