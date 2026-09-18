---
title: "FMLRelaunchLog"
description: "Our special logger for logging issues to."
package: "net/minecraftforge/fml/relauncher"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/fml/relauncher/FMLRelaunchLog.html"
sourceType: javadoc
---

# FMLRelaunchLog

## Class signature

```java
public class FMLRelaunchLog extends java.lang.Object
```

## Methods

- `public static void log(java.lang.String targetLog, org.apache.logging.log4j.Level level, java.lang.String format, java.lang.Object... data)`
- `public static void log(org.apache.logging.log4j.Level level, java.lang.String format, java.lang.Object... data)`
- `public static void log(java.lang.String targetLog, org.apache.logging.log4j.Level level, java.lang.Throwable ex, java.lang.String format, java.lang.Object... data)`
- `public static void log(org.apache.logging.log4j.Level level, java.lang.Throwable ex, java.lang.String format, java.lang.Object... data)`
- `public static void severe(java.lang.String format, java.lang.Object... data)`
- `public static void warning(java.lang.String format, java.lang.Object... data)`
- `public static void info(java.lang.String format, java.lang.Object... data)`
- `public static void fine(java.lang.String format, java.lang.Object... data)`
- `public static void finer(java.lang.String format, java.lang.Object... data)`
- `public org.apache.logging.log4j.Logger getLogger()`

## Description

Our special logger for logging issues to.
