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