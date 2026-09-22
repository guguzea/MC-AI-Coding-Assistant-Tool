---
title: "HighlightErrorConverter"
description: "public class HighlightErrorConverter extends LogEventPatternConverter"
package: "net/minecraftforge/server/terminalconsole"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/server/terminalconsole/HighlightErrorConverter.html"
sourceType: javadoc
---

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
