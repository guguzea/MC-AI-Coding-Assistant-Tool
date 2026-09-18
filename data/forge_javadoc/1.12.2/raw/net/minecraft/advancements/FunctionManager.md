---
title: "FunctionManager"
description: "public class FunctionManager extends java.lang.Object implements ITickable"
package: "net/minecraft/advancements"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/advancements/FunctionManager.html"
sourceType: javadoc
---

# FunctionManager

## Class signature

```java
public class FunctionManager extends java.lang.Object implements ITickable
```

## Constructors

- `public FunctionManager(java.io.File functionDirIn, MinecraftServer serverIn)`

## Methods

- `public FunctionObject getFunction( ResourceLocation id)`
- `public ICommandManager getCommandManager()`
- `public int getMaxCommandChainLength()`
- `public java.util.Map< ResourceLocation , FunctionObject > getFunctions()`
- `public void update()`
- `public int execute( FunctionObject function, ICommandSender sender)`
- `public void reload()`
