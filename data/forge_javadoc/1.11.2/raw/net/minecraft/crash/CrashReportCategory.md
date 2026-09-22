---
title: "CrashReportCategory"
description: "public class CrashReportCategory extends java.lang.Object"
package: "net/minecraft/crash"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/crash/CrashReportCategory.html"
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
- `void addCrashSection(java.lang.String sectionName, java.lang.Object value)`
- `void addCrashSectionThrowable(java.lang.String sectionName, java.lang.Throwable throwable)`
- `void appendToStringBuilder(java.lang.StringBuilder builder)`
- `boolean firstTwoElementsOfStackTraceMatch(java.lang.StackTraceElement s1, java.lang.StackTraceElement s2)`
- `static java.lang.String getCoordinateInfo(BlockPos pos)`
- `static java.lang.String getCoordinateInfo(double x, double y, double z)`
- `static java.lang.String getCoordinateInfo(int x, int y, int z)`
- `int getPrunedStackTrace(int size)`
- `java.lang.StackTraceElement[] getStackTrace()`
- `void setDetail(java.lang.String nameIn, ICrashReportDetail<java.lang.String> detail)`
- `void trimStackTraceEntriesFromBottom(int amount)`
