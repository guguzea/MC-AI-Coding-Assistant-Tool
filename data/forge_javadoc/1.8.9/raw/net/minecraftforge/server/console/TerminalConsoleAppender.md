---
title: "TerminalConsoleAppender"
description: "public class TerminalConsoleAppender extends AbstractAppender"
package: "net/minecraftforge/server/console"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/server/console/TerminalConsoleAppender.html"
sourceType: javadoc
---

# TerminalConsoleAppender

## Class signature

```java
public class TerminalConsoleAppender extends AbstractAppender
```

## Constructors

- `protected TerminalConsoleAppender(java.lang.String name, Filter filter, <any> layout, boolean ignoreExceptions)`

## Methods

- `public static ConsoleReader getReader()`
- `public static void setFormatter(<any> format)`
- `public static TerminalConsoleAppender createAppender(java.lang.String name, Filter filter, <any> layout, java.lang.String ignore)`
- `public void start()`
- `public void append(LogEvent event)`
- `protected java.lang.String formatEvent(LogEvent event)`
