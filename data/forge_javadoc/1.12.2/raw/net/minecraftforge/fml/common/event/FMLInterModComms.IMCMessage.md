---
title: "FMLInterModComms.IMCMessage"
description: "You will receive an instance of this for each message sent"
package: "net/minecraftforge/fml/common/event"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fml/common/event/FMLInterModComms.IMCMessage.html"
sourceType: javadoc
---

# FMLInterModComms.IMCMessage

## Methods

- `public java.lang.String toString()`
- `public java.lang.String getSender()`
- `public java.lang.String getStringValue()`
- `public ResourceLocation getResourceLocationValue()`
- `public NBTTagCompound getNBTValue()`
- `public ItemStack getItemStackValue()`
- `public <T,V> java.util.Optional<java.util.function.Function<T,V>> getFunctionValue(java.lang.Class<T> functionFrom, java.lang.Class<V> functionTo)`
- `public java.lang.Class<?> getMessageType()`
- `public boolean isStringMessage()`
- `public boolean isItemStackMessage()`
- `public boolean isNBTMessage()`
- `public boolean isResourceLocationMessage()`
- `public boolean isFunctionMessage()`

## Description

You will receive an instance of this for each message sent
