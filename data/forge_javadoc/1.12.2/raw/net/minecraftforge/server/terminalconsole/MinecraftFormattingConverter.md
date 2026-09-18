---
title: "MinecraftFormattingConverter"
description: "Replaces Minecraft formatting codes in the result of a pattern with appropriate ANSI escape codes. The implementation will only replace valid color codes using the section sign (§). The MinecraftForma"
package: "net/minecraftforge/server/terminalconsole"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/server/terminalconsole/MinecraftFormattingConverter.html"
sourceType: javadoc
---

# MinecraftFormattingConverter

## Class signature

```java
public class MinecraftFormattingConverter extends LogEventPatternConverter
```

## Constructors

- `protected MinecraftFormattingConverter(java.util.List<PatternFormatter> formatters, boolean strip)`

## Methods

- `public void format(LogEvent event, java.lang.StringBuilder toAppendTo)`
- `public static MinecraftFormattingConverter newInstance(Configuration config, java.lang.String[] options)`

## Description

Replaces Minecraft formatting codes in the result of a pattern with appropriate ANSI escape codes. The implementation will only replace valid color codes using the section sign (§). The MinecraftForma
