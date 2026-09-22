---
title: "EntitySelector"
description: "public class EntitySelector extends java.lang.Object"
package: "net/minecraft/command"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/command/EntitySelector.html"
sourceType: javadoc
---

# EntitySelector

**Inheritance:** java.lang.Object → net.minecraft.command.EntitySelector

## Class signature

```java
public class EntitySelector extends java.lang.Object
```

## Constructors

- `EntitySelector()`

## Methods

- `static java.util.Map<java.lang.String, java.lang.Integer> getScoreMap(java.util.Map<java.lang.String, java.lang.String> params)`
- `static boolean hasArguments(java.lang.String selectorStr)`
- `static<T extends Entity> java.util.List<T> matchEntities(ICommandSender sender, java.lang.String token, java.lang.Class<? extends T> targetClass)`
- `static ITextComponent matchEntitiesToTextComponent(ICommandSender sender, java.lang.String token)`
- `static boolean matchesMultiplePlayers(java.lang.String selectorStr)`
- `static<T extends Entity> T matchOneEntity(ICommandSender sender, java.lang.String token, java.lang.Class<? extends T> targetClass)`
- `static EntityPlayerMP matchOnePlayer(ICommandSender sender, java.lang.String token)`
