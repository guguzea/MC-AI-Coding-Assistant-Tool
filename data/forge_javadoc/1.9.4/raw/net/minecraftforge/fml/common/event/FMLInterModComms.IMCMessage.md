---
title: "FMLInterModComms.IMCMessage"
description: "You will receive an instance of this for each message sent"
package: "net/minecraftforge/fml/common/event"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/fml/common/event/FMLInterModComms.IMCMessage.html"
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
- `public <T,V> com.google.common.base.Optional<com.google.common.base.Function<T,V>> getFunctionValue(java.lang.Class<T> functionFrom, java.lang.Class<V> functionTo)`
- `public java.lang.Class<?> getMessageType()`
- `public boolean isStringMessage()`
- `public boolean isItemStackMessage()`
- `public boolean isNBTMessage()`
- `public boolean isFunctionMessage()`

## Description

You will receive an instance of this for each message sent
