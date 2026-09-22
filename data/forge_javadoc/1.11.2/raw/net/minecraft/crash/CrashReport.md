---
title: "CrashReport"
description: "public class CrashReport extends java.lang.Object"
package: "net/minecraft/crash"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/crash/CrashReport.html"
sourceType: javadoc
---

# CrashReport

**Inheritance:** java.lang.Object → net.minecraft.crash.CrashReport

## Class signature

```java
public class CrashReport extends java.lang.Object
```

## Constructors

- `CrashReport(java.lang.String descriptionIn, java.lang.Throwable causeThrowable)`

## Methods

- `CrashReportCategory getCategory()`
- `java.lang.String getCauseStackTraceOrString()`
- `java.lang.String getCompleteReport()`
- `java.lang.Throwable getCrashCause()`
- `java.lang.String getDescription()`
- `java.io.File getFile()`
- `void getSectionsInStringBuilder(java.lang.StringBuilder builder)`
- `CrashReportCategory makeCategory(java.lang.String name)`
- `CrashReportCategory makeCategoryDepth(java.lang.String categoryName, int stacktraceLength)`
- `static CrashReport makeCrashReport(java.lang.Throwable causeIn, java.lang.String descriptionIn)`
- `boolean saveToFile(java.io.File toFile)`
