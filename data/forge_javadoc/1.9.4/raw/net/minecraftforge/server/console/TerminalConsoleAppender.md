---
title: "TerminalConsoleAppender"
description: "public class TerminalConsoleAppender extends org.apache.logging.log4j.core.appender.AbstractAppender"
package: "net/minecraftforge/server/console"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/server/console/TerminalConsoleAppender.html"
sourceType: javadoc
---

# TerminalConsoleAppender

**Inheritance:** java.lang.Object → org.apache.logging.log4j.core.filter.AbstractFilterable → org.apache.logging.log4j.core.appender.AbstractAppender → net.minecraftforge.server.console.TerminalConsoleAppender

## Class signature

```java
public class TerminalConsoleAppender extends org.apache.logging.log4j.core.appender.AbstractAppender
```

## Methods

- `void append(org.apache.logging.log4j.core.LogEvent event)`
- `static TerminalConsoleAppender createAppender(java.lang.String name, org.apache.logging.log4j.core.Filter filter, org.apache.logging.log4j.core.Layout<? extends java.io.Serializable> layout, java.lang.String ignore)`
- `protected java.lang.String formatEvent(org.apache.logging.log4j.core.LogEvent event)`
- `static jline.console.ConsoleReader getReader()`
- `static void setFormatter(com.google.common.base.Function<java.lang.String, java.lang.String> format)`
- `void start()`

## Fields

- `protected TerminalConsoleAppender`
