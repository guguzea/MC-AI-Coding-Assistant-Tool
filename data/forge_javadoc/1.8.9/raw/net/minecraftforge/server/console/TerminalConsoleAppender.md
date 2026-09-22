---
title: "TerminalConsoleAppender"
description: "public class TerminalConsoleAppender extends AbstractAppender"
package: "net/minecraftforge/server/console"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/server/console/TerminalConsoleAppender.html"
sourceType: javadoc
---

# TerminalConsoleAppender

**Inheritance:** java.lang.Object → AbstractAppender → net.minecraftforge.server.console.TerminalConsoleAppender

## Class signature

```java
public class TerminalConsoleAppender extends AbstractAppender
```

## Constructors

- `TerminalConsoleAppender(java.lang.String name, Filter filter, <any> layout, boolean ignoreExceptions)`

## Methods

- `void append(LogEvent event)`
- `static TerminalConsoleAppender createAppender(java.lang.String name, Filter filter, <any> layout, java.lang.String ignore)`
- `protected java.lang.String formatEvent(LogEvent event)`
- `static ConsoleReader getReader()`
- `static void setFormatter(<any> format)`
- `void start()`
