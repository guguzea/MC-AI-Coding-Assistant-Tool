---
title: "MinecraftFormattingConverter"
description: "public class MinecraftFormattingConverter extends LogEventPatternConverter"
package: "net/minecraftforge/server/terminalconsole"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/server/terminalconsole/MinecraftFormattingConverter.html"
sourceType: javadoc
---

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
