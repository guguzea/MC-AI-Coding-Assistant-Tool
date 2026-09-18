---
title: "CrashReportCategory"
description: "Adds a Crashreport section with the given name with the given value (convered .toString())"
package: "net/minecraft/crash"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/crash/CrashReportCategory.html"
sourceType: javadoc
---

# CrashReportCategory

## Class signature

```java
public class CrashReportCategory extends java.lang.Object
```

## Constructors

- `public CrashReportCategory( CrashReport report, java.lang.String name)`

## Methods

- `public static java.lang.String getCoordinateInfo(double x, double y, double z)`
- `public static java.lang.String getCoordinateInfo( BlockPos pos)`
- `public void addCrashSectionCallable(java.lang.String sectionName, java.util.concurrent.Callable<java.lang.String> callable)`
- `public void addCrashSection(java.lang.String sectionName, java.lang.Object value)`
- `public void addCrashSectionThrowable(java.lang.String sectionName, java.lang.Throwable throwable)`
- `public int getPrunedStackTrace(int size)`
- `public boolean firstTwoElementsOfStackTraceMatch(java.lang.StackTraceElement s1, java.lang.StackTraceElement s2)`
- `public void trimStackTraceEntriesFromBottom(int amount)`
- `public void appendToStringBuilder(java.lang.StringBuilder builder)`
- `public java.lang.StackTraceElement[] getStackTrace()`
- `public static void addBlockInfo( CrashReportCategory category, BlockPos pos, Block blockIn, int blockData)`
- `public static void addBlockInfo( CrashReportCategory category, BlockPos pos, IBlockState state)`

## Description

Adds a Crashreport section with the given name with the given value (convered .toString())
