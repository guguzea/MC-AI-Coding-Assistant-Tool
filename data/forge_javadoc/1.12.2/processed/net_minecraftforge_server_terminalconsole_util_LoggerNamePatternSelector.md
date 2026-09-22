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