---
title: "LoggerNamePatternSelector"
description: "A PatternSelector that selects patterns based on the logger name. Can be used to log messages from different loggers using different patterns. Multiple logger names may be separated using comma in the"
package: "net/minecraftforge/server/terminalconsole/util"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/server/terminalconsole/util/LoggerNamePatternSelector.html"
sourceType: javadoc
---

# LoggerNamePatternSelector

## Class signature

```java
public class LoggerNamePatternSelector extends java.lang.Object
```

## Constructors

- `protected LoggerNamePatternSelector(java.lang.String defaultPattern, PatternMatch[] properties, boolean alwaysWriteExceptions, boolean disableAnsi, boolean noConsoleNoAnsi, Configuration config)`

## Methods

- `public PatternFormatter[] getFormatters(LogEvent event)`
- `public static LoggerNamePatternSelector createSelector(java.lang.String defaultPattern, PatternMatch[] properties, boolean alwaysWriteExceptions, boolean disableAnsi, boolean noConsoleNoAnsi, Configuration config)`

## Description

A PatternSelector that selects patterns based on the logger name. Can be used to log messages from different loggers using different patterns. Multiple logger names may be separated using comma in the
