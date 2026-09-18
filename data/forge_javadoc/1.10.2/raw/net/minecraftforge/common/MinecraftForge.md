---
title: "MinecraftForge"
description: "The core Forge EventBusses, all events for Forge will be fired on these, you should use this to register all your listeners."
package: "net/minecraftforge/common"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/common/MinecraftForge.html"
sourceType: javadoc
---

# MinecraftForge

## Class signature

```java
public class MinecraftForge extends java.lang.Object
```

## Constructors

- `public MinecraftForge()`

## Methods

- `public static void addGrassSeed( ItemStack seed, int weight)`
- `public static void addGrassSeed(net.minecraftforge.common.ForgeHooks.SeedEntry seed)`
- `public static void initialize()`
- `public static void preloadCrashClasses( ASMDataTable table, java.lang.String modID, java.util.Set<java.lang.String> classes)`

## Description

The core Forge EventBusses, all events for Forge will be fired on these, you should use this to register all your listeners.
