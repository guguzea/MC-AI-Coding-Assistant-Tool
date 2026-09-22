# FMLInterModComms

**Inheritance:** java.lang.Object → cpw.mods.fml.common.event.FMLInterModComms

## Class signature

```java
public class FMLInterModComms extends java.lang.Object
```

## Constructors

- `FMLInterModComms()`

## Methods

- `static<any> fetchRuntimeMessages(java.lang.Object forMod)` — Retrieve any pending runtime messages for the mod
- `static boolean sendMessage(java.lang.String modId, java.lang.String key, ItemStack value)`
- `static boolean sendMessage(java.lang.String modId, java.lang.String key, NBTTagCompound value)`
- `static boolean sendMessage(java.lang.String modId, java.lang.String key, java.lang.String value)`
- `static void sendRuntimeMessage(java.lang.Object sourceMod, java.lang.String modId, java.lang.String key, ItemStack value)`
- `static void sendRuntimeMessage(java.lang.Object sourceMod, java.lang.String modId, java.lang.String key, NBTTagCompound value)`
- `static void sendRuntimeMessage(java.lang.Object sourceMod, java.lang.String modId, java.lang.String key, java.lang.String value)`