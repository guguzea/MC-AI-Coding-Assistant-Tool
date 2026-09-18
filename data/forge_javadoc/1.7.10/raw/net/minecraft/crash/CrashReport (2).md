---
title: "CrashReport"
description: "public class CrashReport extends java.lang.Object"
package: "net/minecraft/crash"
version: "1.7.10"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/net/minecraft/crash/CrashReport.html"
sourceType: javadoc
---

# CrashReport

## Class signature

```java
public class CrashReport extends java.lang.Object
```

## Constructors

- `public CrashReport(java.lang.String p_i1348_1_, java.lang.Throwable p_i1348_2_)`

## Methods

- `public java.lang.String getDescription()`
- `public java.lang.Throwable getCrashCause()`
- `public void getSectionsInStringBuilder(java.lang.StringBuilder p_71506_1_)`
- `public java.lang.String getCauseStackTraceOrString()`
- `public java.lang.String getCompleteReport()`
- `public java.io.File getFile()`
- `public boolean saveToFile(java.io.File p_147149_1_)`
- `public CrashReportCategory getCategory()`
- `public CrashReportCategory makeCategory(java.lang.String p_85058_1_)`
- `public CrashReportCategory makeCategoryDepth(java.lang.String p_85057_1_, int p_85057_2_)`
- `public static CrashReport makeCrashReport(java.lang.Throwable p_85055_0_, java.lang.String p_85055_1_)`
