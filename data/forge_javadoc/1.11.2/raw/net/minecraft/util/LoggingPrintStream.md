---
title: "LoggingPrintStream"
description: "public class LoggingPrintStream extends java.io.PrintStream"
package: "net/minecraft/util"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/util/LoggingPrintStream.html"
sourceType: javadoc
---

# LoggingPrintStream

**Inheritance:** java.lang.Object → java.io.OutputStream → java.io.FilterOutputStream → java.io.PrintStream → net.minecraft.util.LoggingPrintStream

## Class signature

```java
public class LoggingPrintStream extends java.io.PrintStream
```

## Constructors

- `LoggingPrintStream(java.lang.String domainIn, java.io.OutputStream outStream)`

## Methods

- `protected void logString(java.lang.String string)`
- `void println(java.lang.Object p_println_1_)`
- `void println(java.lang.String p_println_1_)`

## Fields

- `protected java.lang.String domain`
- `protected static org.apache.logging.log4j.Logger LOGGER`
