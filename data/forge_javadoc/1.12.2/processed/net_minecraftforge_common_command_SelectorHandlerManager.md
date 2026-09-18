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