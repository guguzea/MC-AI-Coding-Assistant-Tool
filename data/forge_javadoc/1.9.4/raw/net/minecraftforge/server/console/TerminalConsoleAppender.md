---
title: "TerminalConsoleAppender"
description: "public class TerminalConsoleAppender extends org.apache.logging.log4j.core.appender.AbstractAppender"
package: "net/minecraftforge/server/console"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/server/console/TerminalConsoleAppender.html"
sourceType: javadoc
---

# TerminalConsoleAppender

## Class signature

```java
public class TerminalConsoleAppender extends org.apache.logging.log4j.core.appender.AbstractAppender
```

## Constructors

- `protected TerminalConsoleAppender(java.lang.String name, org.apache.logging.log4j.core.Filter filter, org.apache.logging.log4j.core.Layout<? extends java.io.Serializable> layout, boolean ignoreExceptions)`

## Methods

- `public static jline.console.ConsoleReader getReader()`
- `public static void setFormatter(com.google.common.base.Function<java.lang.String,java.lang.String> format)`
- `public static TerminalConsoleAppender createAppender(java.lang.String name, org.apache.logging.log4j.core.Filter filter, org.apache.logging.log4j.core.Layout<? extends java.io.Serializable> layout, java.lang.String ignore)`
- `public void start()`
- `public void append(org.apache.logging.log4j.core.LogEvent event)`
- `protected java.lang.String formatEvent(org.apache.logging.log4j.core.LogEvent event)`
