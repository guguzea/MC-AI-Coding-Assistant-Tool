# MinecraftFormattingConverter

**Inheritance:** java.lang.Object → LogEventPatternConverter → net.minecraftforge.server.terminalconsole.MinecraftFormattingConverter

## Class signature

```java
public class MinecraftFormattingConverter extends LogEventPatternConverter
```

## Constructors

- `MinecraftFormattingConverter(java.util.List<PatternFormatter> formatters, boolean strip)`

## Methods

- `void format(LogEvent event, java.lang.StringBuilder toAppendTo)`
- `static MinecraftFormattingConverter newInstance(Configuration config, java.lang.String[] options)` — Gets a new instance of the MinecraftFormattingConverter with the specified options.

## Fields

- `static java.lang.String KEEP_FORMATTING_PROPERTY` — System property that allows disabling the replacement of Minecraft formatting codes entirely, keeping them in the console output.