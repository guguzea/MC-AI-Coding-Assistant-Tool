---
title: "FMLLog"
description: "public class FMLLog extends java.lang.Object"
package: "net/minecraftforge/fml/common"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/fml/common/FMLLog.html"
sourceType: javadoc
---

# FMLLog

## Class signature

```java
public class FMLLog extends java.lang.Object
```

## Constructors

- `public FMLLog()`

## Methods

- `public static void log(java.lang.String targetLog, org.apache.logging.log4j.Level level, java.lang.String format, java.lang.Object... data)`
- `public static void log(org.apache.logging.log4j.Level level, java.lang.String format, java.lang.Object... data)`
- `public static void log(java.lang.String targetLog, org.apache.logging.log4j.Level level, java.lang.Throwable ex, java.lang.String format, java.lang.Object... data)`
- `public static void log(org.apache.logging.log4j.Level level, java.lang.Throwable ex, java.lang.String format, java.lang.Object... data)`
- `public static void severe(java.lang.String format, java.lang.Object... data)`
- `public static void bigWarning(java.lang.String format, java.lang.Object... data)`
- `public static void warning(java.lang.String format, java.lang.Object... data)`
- `public static void info(java.lang.String format, java.lang.Object... data)`
- `public static void fine(java.lang.String format, java.lang.Object... data)`
- `public static void finer(java.lang.String format, java.lang.Object... data)`
- `public static org.apache.logging.log4j.Logger getLogger()`
