---
title: "Profiler"
description: "public class Profiler extends java.lang.Object"
package: "net/minecraft/profiler"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/profiler/Profiler.html"
sourceType: javadoc
---

# Profiler

**Inheritance:** java.lang.Object → net.minecraft.profiler.Profiler

## Class signature

```java
public class Profiler extends java.lang.Object
```

## Constructors

- `Profiler()`

## Methods

- `void clearProfiling()`
- `void endSection()`
- `void endStartSection(java.lang.String name)`
- `void func_194339_b(java.util.function.Supplier<java.lang.String> p_194339_1_)`
- `void func_194340_a(java.util.function.Supplier<java.lang.String> p_194340_1_)`
- `java.lang.String getNameOfLastSection()`
- `java.util.List<Profiler.Result> getProfilingData(java.lang.String profilerName)`
- `@Deprecated void startSection(java.lang.Class<?> profiledClass)`
- `void startSection(java.lang.String name)`

## Fields

- `boolean profilingEnabled`
