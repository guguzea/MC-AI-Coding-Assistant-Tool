---
title: "SelectorHandlerManager"
description: "Allows registration of custom selector types by assigning a SelectorHandler to a prefix This class handles calls to the EntitySelector methods matchEntities , matchesMultiplePlayers and isSelector . T"
package: "net/minecraftforge/common/command"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/common/command/SelectorHandlerManager.html"
sourceType: javadoc
---

# SelectorHandlerManager

## Class signature

```java
public class SelectorHandlerManager extends java.lang.Object
```

## Methods

- `public static void register(java.lang.String prefix, SelectorHandler handler)`
- `public static SelectorHandler getHandler(java.lang.String selectorStr)`
- `public static <T extends Entity > java.util.List<T> matchEntities( ICommandSender sender, java.lang.String token, java.lang.Class<? extends T> targetClass) throws CommandException`
- `public static boolean matchesMultiplePlayers(java.lang.String selectorStr) throws CommandException`
- `public static boolean isSelector(java.lang.String selectorStr)`

## Description

Allows registration of custom selector types by assigning a SelectorHandler to a prefix This class handles calls to the EntitySelector methods matchEntities , matchesMultiplePlayers and isSelector . T
