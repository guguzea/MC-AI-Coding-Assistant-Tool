---
title: "FMLInterModComms"
description: "Simple intermod communications to receive simple messages directed at you from other mods"
package: "net/minecraftforge/fml/common/event"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fml/common/event/FMLInterModComms.html"
sourceType: javadoc
---

# FMLInterModComms

## Class signature

```java
public class FMLInterModComms extends java.lang.Object
```

## Constructors

- `public FMLInterModComms()`

## Methods

- `public static boolean sendMessage(java.lang.String modId, java.lang.String key, NBTTagCompound value)`
- `public static boolean sendMessage(java.lang.String modId, java.lang.String key, ItemStack value)`
- `public static boolean sendMessage(java.lang.String modId, java.lang.String key, ResourceLocation value)`
- `public static boolean sendMessage(java.lang.String modId, java.lang.String key, java.lang.String value)`
- `public static boolean sendFunctionMessage(java.lang.String modId, java.lang.String key, java.lang.String functionClassName)`
- `public static void sendRuntimeMessage(java.lang.Object sourceMod, java.lang.String modId, java.lang.String key, NBTTagCompound value)`
- `public static void sendRuntimeMessage(java.lang.Object sourceMod, java.lang.String modId, java.lang.String key, ItemStack value)`
- `public static void sendRuntimeMessage(java.lang.Object sourceMod, java.lang.String modId, java.lang.String key, java.lang.String value)`
- `public static void sendRuntimeMessage(java.lang.Object sourceMod, java.lang.String modId, java.lang.String key, ResourceLocation value)`
- `public static void sendRuntimeFunctionMessage(java.lang.Object sourceMod, java.lang.String modId, java.lang.String key, java.lang.String functionClassName)`
- `public static <any> fetchRuntimeMessages(java.lang.Object forMod)`

## Description

Simple intermod communications to receive simple messages directed at you from other mods
