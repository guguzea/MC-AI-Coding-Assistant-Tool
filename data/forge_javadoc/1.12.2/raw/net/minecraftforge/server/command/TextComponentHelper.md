---
title: "TextComponentHelper"
description: "Detects when sending to a vanilla client and falls back to sending english, since they don't have the lang data necessary to translate on the client."
package: "net/minecraftforge/server/command"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/server/command/TextComponentHelper.html"
sourceType: javadoc
---

# TextComponentHelper

## Class signature

```java
public class TextComponentHelper extends java.lang.Object
```

## Methods

- `public static TextComponentBase createComponentTranslation( ICommandSender sender, java.lang.String translation, java.lang.Object... args)`

## Description

Detects when sending to a vanilla client and falls back to sending english, since they don't have the lang data necessary to translate on the client.
