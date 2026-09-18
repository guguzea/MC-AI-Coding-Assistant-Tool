---
title: "PlayerSelector"
description: "Returns whether the given token has any arguments set."
package: "net/minecraft/command"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/command/PlayerSelector.html"
sourceType: javadoc
---

# PlayerSelector

## Class signature

```java
public class PlayerSelector extends java.lang.Object
```

## Constructors

- `public PlayerSelector()`

## Methods

- `public static EntityPlayerMP matchOnePlayer( ICommandSender sender, java.lang.String token)`
- `public static <T extends Entity > T matchOneEntity( ICommandSender sender, java.lang.String token, java.lang.Class<? extends T> targetClass)`
- `public static IChatComponent matchEntitiesToChatComponent( ICommandSender sender, java.lang.String token)`
- `public static <T extends Entity > java.util.List<T> matchEntities( ICommandSender sender, java.lang.String token, java.lang.Class<? extends T> targetClass)`
- `public static int func_179650_a(int p_179650_0_)`
- `public static java.util.Map<java.lang.String,java.lang.Integer> func_96560_a(java.util.Map<java.lang.String,java.lang.String> p_96560_0_)`
- `public static boolean matchesMultiplePlayers(java.lang.String p_82377_0_)`
- `public static boolean hasArguments(java.lang.String p_82378_0_)`

## Description

Returns whether the given token has any arguments set.
