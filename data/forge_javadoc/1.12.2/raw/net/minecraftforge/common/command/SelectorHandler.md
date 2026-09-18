---
title: "SelectorHandler"
description: "Handler for custom types of selectors registered with SelectorHandlerManager"
package: "net/minecraftforge/common/command"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/common/command/SelectorHandler.html"
sourceType: javadoc
---

# SelectorHandler

## Class signature

```java
public interface SelectorHandler
```

## Methods

- `<T extends Entity > java.util.List<T> matchEntities( ICommandSender sender, java.lang.String token, java.lang.Class<? extends T> targetClass) throws CommandException`
- `boolean matchesMultiplePlayers(java.lang.String selectorStr) throws CommandException`
- `boolean isSelector(java.lang.String selectorStr)`

## Description

Handler for custom types of selectors registered with SelectorHandlerManager
