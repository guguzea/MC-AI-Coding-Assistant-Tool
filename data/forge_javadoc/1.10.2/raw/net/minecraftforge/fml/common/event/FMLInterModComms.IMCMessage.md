---
title: "FMLInterModComms.IMCMessage"
description: "public static final class FMLInterModComms.IMCMessage extends java.lang.Object"
package: "net/minecraftforge/fml/common/event"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/fml/common/event/FMLInterModComms.IMCMessage.html"
sourceType: javadoc
---

# FMLInterModComms.IMCMessage

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.event.FMLInterModComms.IMCMessage

## Class signature

```java
public static final class FMLInterModComms.IMCMessage extends java.lang.Object
```

## Methods

- `<T, V> com.google.common.base.Optional<com.google.common.base.Function<T, V>> getFunctionValue(java.lang.Class<T> functionFrom, java.lang.Class<V> functionTo)` — Get the Function value from this message.
- `ItemStack getItemStackValue()` — Get the ItemStack value from this message
- `java.lang.Class<?> getMessageType()` — Get the actual message class type
- `NBTTagCompound getNBTValue()` — Get the NBTTagCompound value from this message
- `ResourceLocation getResourceLocationValue()` — Get the ResourceLocation value from this message.
- `java.lang.String getSender()` — Get the sending modId of this message.
- `java.lang.String getStringValue()` — Get the string value from this message.
- `boolean isFunctionMessage()` — Is this a Function type message
- `boolean isItemStackMessage()` — Is this an ItemStack type message
- `boolean isNBTMessage()` — Is this an NBTTagCompound type message
- `boolean isResourceLocationMessage()` — Is this an ResourceLocation type message
- `boolean isStringMessage()` — Is this a string type message
- `java.lang.String toString()`

## Fields

- `java.lang.String key` — This field, and value are both at the mod's discretion
