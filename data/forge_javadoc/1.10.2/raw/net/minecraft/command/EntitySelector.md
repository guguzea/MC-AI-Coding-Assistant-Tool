---
title: "EntitySelector"
description: "public class EntitySelector extends java.lang.Object"
package: "net/minecraft/command"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/command/EntitySelector.html"
sourceType: javadoc
---

# EntitySelector

## Class signature

```java
public class EntitySelector extends java.lang.Object
```

## Constructors

- `public EntitySelector()`

## Methods

- `@Nullable public static EntityPlayerMP matchOnePlayer( ICommandSender sender, java.lang.String token)`
- `@Nullable public static <T extends Entity > T matchOneEntity( ICommandSender sender, java.lang.String token, java.lang.Class<? extends T> targetClass)`
- `@Nullable public static ITextComponent matchEntitiesToTextComponent( ICommandSender sender, java.lang.String token)`
- `public static <T extends Entity > java.util.List<T> matchEntities( ICommandSender sender, java.lang.String token, java.lang.Class<? extends T> targetClass)`
- `public static java.util.Map<java.lang.String,java.lang.Integer> getScoreMap(java.util.Map<java.lang.String,java.lang.String> params)`
- `public static boolean matchesMultiplePlayers(java.lang.String selectorStr)`
- `public static boolean hasArguments(java.lang.String selectorStr)`
