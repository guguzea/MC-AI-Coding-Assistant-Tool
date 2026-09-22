---
title: "CrashReportCategory"
description: "public class CrashReportCategory extends java.lang.Object"
package: "net/minecraft/crash"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/crash/CrashReportCategory.html"
sourceType: javadoc
---

# CrashReportCategory

**Inheritance:** java.lang.Object → net.minecraft.crash.CrashReportCategory

## Class signature

```java
public class CrashReportCategory extends java.lang.Object
```

## Constructors

- `CrashReportCategory(CrashReport report, java.lang.String name)`

## Methods

- `static void addBlockInfo(CrashReportCategory category, BlockPos pos, Block blockIn, int blockData)`
- `static void addBlockInfo(CrashReportCategory category, BlockPos pos, IBlockState state)`
- `void addCrashSection(java.lang.String sectionName, java.lang.Object value)` — Adds a Crashreport section with the given name with the given value (convered .toString())
- `void addCrashSectionCallable(java.lang.String sectionName, java.util.concurrent.Callable<java.lang.String> callable)` — Adds a Crashreport section with the given name with the value set to the result of the given Callable;
- `void addCrashSectionThrowable(java.lang.String sectionName, java.lang.Throwable throwable)` — Adds a Crashreport section with the given name with the given Throwable
- `void appendToStringBuilder(java.lang.StringBuilder builder)`
- `boolean firstTwoElementsOfStackTraceMatch(java.lang.StackTraceElement s1, java.lang.StackTraceElement s2)` — Do the deepest two elements of our saved stack trace match the given elements, in order from the deepest?
- `static java.lang.String getCoordinateInfo(BlockPos pos)`
- `static java.lang.String getCoordinateInfo(double x, double y, double z)`
- `int getPrunedStackTrace(int size)` — Resets our stack trace according to the current trace, pruning the deepest 3 entries.
- `java.lang.StackTraceElement[] getStackTrace()`
- `void trimStackTraceEntriesFromBottom(int amount)` — Removes the given number entries from the bottom of the stack trace.
