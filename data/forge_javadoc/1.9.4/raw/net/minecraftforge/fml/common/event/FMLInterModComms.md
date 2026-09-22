---
title: "FMLInterModComms"
description: "public class FMLInterModComms extends java.lang.Object"
package: "net/minecraftforge/fml/common/event"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/fml/common/event/FMLInterModComms.html"
sourceType: javadoc
---

# FMLInterModComms

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.event.FMLInterModComms

## Class signature

```java
public class FMLInterModComms extends java.lang.Object
```

## Constructors

- `FMLInterModComms()`

## Methods

- `static com.google.common.collect.ImmutableList<FMLInterModComms.IMCMessage> fetchRuntimeMessages(java.lang.Object forMod)` — Retrieve any pending runtime messages for the mod
- `static boolean sendFunctionMessage(java.lang.String modId, java.lang.String key, java.lang.String functionClassName)` — Send a startup time function message
- `static boolean sendMessage(java.lang.String modId, java.lang.String key, ItemStack value)` — Send a startup time message
- `static boolean sendMessage(java.lang.String modId, java.lang.String key, NBTTagCompound value)` — Send a startup time message
- `static boolean sendMessage(java.lang.String modId, java.lang.String key, ResourceLocation value)` — Send a startup time message
- `static boolean sendMessage(java.lang.String modId, java.lang.String key, java.lang.String value)` — Send a startup time message
- `static void sendRuntimeFunctionMessage(java.lang.Object sourceMod, java.lang.String modId, java.lang.String key, java.lang.String functionClassName)` — Send a post-startup function message.
- `static void sendRuntimeMessage(java.lang.Object sourceMod, java.lang.String modId, java.lang.String key, ItemStack value)` — Send a post-startup message
- `static void sendRuntimeMessage(java.lang.Object sourceMod, java.lang.String modId, java.lang.String key, NBTTagCompound value)` — Send a post-startup message
- `static void sendRuntimeMessage(java.lang.Object sourceMod, java.lang.String modId, java.lang.String key, ResourceLocation value)` — Send a post-startup message
- `static void sendRuntimeMessage(java.lang.Object sourceMod, java.lang.String modId, java.lang.String key, java.lang.String value)` — Send a post-startup message
