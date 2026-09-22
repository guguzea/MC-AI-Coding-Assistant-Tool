---
title: "SelectorHandler"
description: "public interface SelectorHandler"
package: "net/minecraftforge/common/command"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/common/command/SelectorHandler.html"
sourceType: javadoc
---

# SelectorHandler

## Class signature

```java
public interface SelectorHandler
```

## Methods

- `boolean isSelector(java.lang.String selectorStr)` — Returns whether the string matches the overall syntax of the selector Note: If this returns false , matchEntities(net.minecraft.command.ICommandSender, java.lang.String, java.lang.Class<? extends T>) should return an empty list
- `<T extends Entity> java.util.List<T> matchEntities(ICommandSender sender, java.lang.String token, java.lang.Class<? extends T> targetClass)` — Returns a List of Entities of class targetClass ( T ) represented by token Note: If token does not match the overall syntax defined by isSelector(java.lang.String) , this method should return an empty list.
- `boolean matchesMultiplePlayers(java.lang.String selectorStr)` — Returns whether the selector string potentially matches multiple entities
