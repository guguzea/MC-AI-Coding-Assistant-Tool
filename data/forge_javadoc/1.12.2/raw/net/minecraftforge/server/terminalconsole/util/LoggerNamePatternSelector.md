---
title: "LoggerNamePatternSelector"
description: "public class LoggerNamePatternSelector extends java.lang.Object"
package: "net/minecraftforge/server/terminalconsole/util"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/server/terminalconsole/util/LoggerNamePatternSelector.html"
sourceType: javadoc
---

# LoggerNamePatternSelector

**Inheritance:** java.lang.Object → net.minecraftforge.server.terminalconsole.util.LoggerNamePatternSelector

## Class signature

```java
public class LoggerNamePatternSelector extends java.lang.Object
```

## Constructors

- `LoggerNamePatternSelector(java.lang.String defaultPattern, PatternMatch[] properties, boolean alwaysWriteExceptions, boolean disableAnsi, boolean noConsoleNoAnsi, Configuration config)`

## Methods

- `static LoggerNamePatternSelector createSelector(java.lang.String defaultPattern, PatternMatch[] properties, boolean alwaysWriteExceptions, boolean disableAnsi, boolean noConsoleNoAnsi, Configuration config)` — Creates a new LoggerNamePatternSelector .
- `PatternFormatter[] getFormatters(LogEvent event)`
