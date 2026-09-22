# HighlightErrorConverter

**Inheritance:** java.lang.Object → LogEventPatternConverter → net.minecraftforge.server.terminalconsole.HighlightErrorConverter

## Class signature

```java
public class HighlightErrorConverter extends LogEventPatternConverter
```

## Constructors

- `HighlightErrorConverter(java.util.List<PatternFormatter> formatters)`

## Methods

- `void format(LogEvent event, java.lang.StringBuilder toAppendTo)`
- `boolean handlesThrowable()`
- `static HighlightErrorConverter newInstance(Configuration config, java.lang.String[] options)` — Gets a new instance of the HighlightErrorConverter with the specified options.