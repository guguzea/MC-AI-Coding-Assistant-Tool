# TerminalConsoleAppender

## Class signature

```java
public class TerminalConsoleAppender extends AbstractAppender
```

## Constructors

- `protected TerminalConsoleAppender(java.lang.String name, Filter filter, <any> layout, boolean ignoreExceptions)`

## Methods

- `public static Terminal getTerminal()`
- `public static LineReader getReader()`
- `public static void setReader(LineReader newReader)`
- `public static boolean isAnsiSupported()`
- `public void append(LogEvent event)`
- `public static void close() throws java.io.IOException`
- `public static TerminalConsoleAppender createAppender(java.lang.String name, Filter filter, <any> layout, boolean ignoreExceptions)`

## Description

An Appender that uses the JLine 3.x Terminal to print messages to the console. The JLine Terminal extends the regular console output with support for Ansi escape codes on Windows. Additionally, it's L