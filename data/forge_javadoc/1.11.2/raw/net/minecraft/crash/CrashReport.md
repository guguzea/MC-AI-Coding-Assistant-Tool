---
title: "CrashReport"
description: "public class CrashReport extends java.lang.Object"
package: "net/minecraft/crash"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/crash/CrashReport.html"
sourceType: javadoc
---

# CrashReport

## Class signature

```java
public class CrashReport extends java.lang.Object
```

## Constructors

- `public CrashReport(java.lang.String descriptionIn, java.lang.Throwable causeThrowable)`

## Methods

- `public java.lang.String getDescription()`
- `public java.lang.Throwable getCrashCause()`
- `public void getSectionsInStringBuilder(java.lang.StringBuilder builder)`
- `public java.lang.String getCauseStackTraceOrString()`
- `public java.lang.String getCompleteReport()`
- `public java.io.File getFile()`
- `public boolean saveToFile(java.io.File toFile)`
- `public CrashReportCategory getCategory()`
- `public CrashReportCategory makeCategory(java.lang.String name)`
- `public CrashReportCategory makeCategoryDepth(java.lang.String categoryName, int stacktraceLength)`
- `public static CrashReport makeCrashReport(java.lang.Throwable causeIn, java.lang.String descriptionIn)`
