---
title: "PlayerSelector"
description: "public class PlayerSelector extends java.lang.Object"
package: "net/minecraft/command"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/command/PlayerSelector.html"
sourceType: javadoc
---

# PlayerSelector

**Inheritance:** java.lang.Object → net.minecraft.command.PlayerSelector

## Class signature

```java
public class PlayerSelector extends java.lang.Object
```

## Constructors

- `PlayerSelector()`

## Methods

- `static int func_179650_a(int p_179650_0_)`
- `static java.util.Map<java.lang.String, java.lang.Integer> func_96560_a(java.util.Map<java.lang.String, java.lang.String> p_96560_0_)`
- `static boolean hasArguments(java.lang.String p_82378_0_)` — Returns whether the given token has any arguments set.
- `static<T extends Entity> java.util.List<T> matchEntities(ICommandSender sender, java.lang.String token, java.lang.Class<? extends T> targetClass)`
- `static IChatComponent matchEntitiesToChatComponent(ICommandSender sender, java.lang.String token)`
- `static boolean matchesMultiplePlayers(java.lang.String p_82377_0_)` — Returns whether the given pattern can match more than one player.
- `static<T extends Entity> T matchOneEntity(ICommandSender sender, java.lang.String token, java.lang.Class<? extends T> targetClass)`
- `static EntityPlayerMP matchOnePlayer(ICommandSender sender, java.lang.String token)` — Returns the one player that matches the given at-token.
