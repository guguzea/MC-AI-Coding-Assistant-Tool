---
title: "FunctionManager"
description: "public class FunctionManager extends java.lang.Object implements ITickable"
package: "net/minecraft/advancements"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/advancements/FunctionManager.html"
sourceType: javadoc
---

# FunctionManager

**Inheritance:** java.lang.Object → net.minecraft.advancements.FunctionManager

## Class signature

```java
public class FunctionManager extends java.lang.Object implements ITickable
```

## Constructors

- `FunctionManager(java.io.File functionDirIn, MinecraftServer serverIn)`

## Methods

- `int execute(FunctionObject function, ICommandSender sender)`
- `ICommandManager getCommandManager()`
- `FunctionObject getFunction(ResourceLocation id)`
- `java.util.Map<ResourceLocation, FunctionObject> getFunctions()`
- `int getMaxCommandChainLength()`
- `void reload()`
- `void update()`
