# LoggingPrintStream

**Inheritance:** java.lang.Object → java.io.OutputStream → java.io.FilterOutputStream → java.io.PrintStream → net.minecraft.util.LoggingPrintStream

## Class signature

```java
public class LoggingPrintStream extends java.io.PrintStream
```

## Constructors

- `LoggingPrintStream(java.lang.String domainIn, java.io.OutputStream outStream)`

## Methods

- `protected void logString(java.lang.String string)`
- `void println(java.lang.Object p_println_1_)`
- `void println(java.lang.String p_println_1_)`

## Fields

- `protected java.lang.String domain`
- `protected static org.apache.logging.log4j.Logger LOGGER`