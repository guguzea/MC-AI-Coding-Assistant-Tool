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
- `public static boolean sendMessage(java.lang.String modId, java.lang.String key, java.lang.String value)`
- `public static void sendRuntimeMessage(java.lang.Object sourceMod, java.lang.String modId, java.lang.String key, NBTTagCompound value)`
- `public static void sendRuntimeMessage(java.lang.Object sourceMod, java.lang.String modId, java.lang.String key, ItemStack value)`
- `public static void sendRuntimeMessage(java.lang.Object sourceMod, java.lang.String modId, java.lang.String key, java.lang.String value)`
- `public static <any> fetchRuntimeMessages(java.lang.Object forMod)`

## Description

Simple intermod communications to receive simple messages directed at you from other mods