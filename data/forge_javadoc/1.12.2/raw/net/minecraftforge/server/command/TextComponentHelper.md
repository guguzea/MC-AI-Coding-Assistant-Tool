---
title: "TextComponentHelper"
description: "public class TextComponentHelper extends java.lang.Object"
package: "net/minecraftforge/server/command"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/server/command/TextComponentHelper.html"
sourceType: javadoc
---

# TextComponentHelper

**Inheritance:** java.lang.Object → net.minecraftforge.server.command.TextComponentHelper

## Class signature

```java
public class TextComponentHelper extends java.lang.Object
```

## Methods

- `static TextComponentBase createComponentTranslation(ICommandSender sender, java.lang.String translation, java.lang.Object... args)` — Detects when sending to a vanilla client and falls back to sending english, since they don't have the lang data necessary to translate on the client.
