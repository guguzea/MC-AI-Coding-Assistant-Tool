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