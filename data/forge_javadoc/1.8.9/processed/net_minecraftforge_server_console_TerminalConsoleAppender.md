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