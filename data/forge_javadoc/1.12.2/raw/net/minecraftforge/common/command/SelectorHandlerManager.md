---
title: "SelectorHandlerManager"
description: "public class SelectorHandlerManager extends java.lang.Object"
package: "net/minecraftforge/common/command"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/common/command/SelectorHandlerManager.html"
sourceType: javadoc
---

# SelectorHandlerManager

**Inheritance:** java.lang.Object → net.minecraftforge.common.command.SelectorHandlerManager

## Class signature

```java
public class SelectorHandlerManager extends java.lang.Object
```

## Methods

- `static SelectorHandler getHandler(java.lang.String selectorStr)` — Returns the best matching handler for the given string.
- `static boolean isSelector(java.lang.String selectorStr)`
- `static<T extends Entity> java.util.List<T> matchEntities(ICommandSender sender, java.lang.String token, java.lang.Class<? extends T> targetClass)`
- `static boolean matchesMultiplePlayers(java.lang.String selectorStr)`
- `static void register(java.lang.String prefix, SelectorHandler handler)` — Registers a new SelectorHandler for prefix .

## Fields

- `static java.util.NavigableMap<java.lang.String, java.lang.String> registeringMods`
- `static java.util.NavigableMap<java.lang.String, SelectorHandler> selectorHandlers`
