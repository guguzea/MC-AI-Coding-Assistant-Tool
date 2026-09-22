---
title: "TerminalConsoleAppender"
description: "public class TerminalConsoleAppender extends AbstractAppender"
package: "net/minecraftforge/server/terminalconsole"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/server/terminalconsole/TerminalConsoleAppender.html"
sourceType: javadoc
---

# TerminalConsoleAppender

**Inheritance:** java.lang.Object → AbstractAppender → net.minecraftforge.server.terminalconsole.TerminalConsoleAppender

## Class signature

```java
public class TerminalConsoleAppender extends AbstractAppender
```

## Constructors

- `TerminalConsoleAppender(java.lang.String name, Filter filter, <any> layout, boolean ignoreExceptions)`

## Methods

- `void append(LogEvent event)`
- `static void close()` — Closes the JLine Terminal (if available) and restores the original terminal settings.
- `static TerminalConsoleAppender createAppender(java.lang.String name, Filter filter, <any> layout, boolean ignoreExceptions)` — Creates a new TerminalConsoleAppender .
- `static LineReader getReader()` — Returns the currently configured LineReader that is used to read input from the console.
- `static Terminal getTerminal()` — Returns the Terminal that is used to print messages to the console.
- `static boolean isAnsiSupported()` — Returns whether ANSI escapes codes should be written to the console output.
- `static void setReader(LineReader newReader)` — Sets the LineReader that is used to read input from the console.

## Fields

- `static java.lang.Boolean ANSI_OVERRIDE`
- `static java.lang.String ANSI_OVERRIDE_PROPERTY` — System property that allows overriding the use of ANSI escape codes for console formatting even though running in an unsupported environment.
- `static java.lang.String JLINE_OVERRIDE_PROPERTY` — System property that allows overriding the default detection of the console to force enable or force disable the use of JLine.
- `static java.lang.String PLUGIN_NAME`
- `static java.lang.String PROPERTY_PREFIX` — The prefix used for all system properties in TerminalConsoleAppender.
