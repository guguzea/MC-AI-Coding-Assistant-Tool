# HighlightErrorConverter

## Class signature

```java
public class HighlightErrorConverter extends LogEventPatternConverter
```

## Constructors

- `protected HighlightErrorConverter(java.util.List<PatternFormatter> formatters)`

## Methods

- `public void format(LogEvent event, java.lang.StringBuilder toAppendTo)`
- `public boolean handlesThrowable()`
- `public static HighlightErrorConverter newInstance(Configuration config, java.lang.String[] options)`

## Description

A simplified version of HighlightConverter that uses TerminalConsoleAppender to detect if Ansi escape codes can be used to highlight errors and warnings in the console. If configured, it will mark all