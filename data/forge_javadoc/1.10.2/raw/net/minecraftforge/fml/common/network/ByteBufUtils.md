---
title: "ByteBufUtils"
description: "Utilities for interacting with ByteBuf ."
package: "net/minecraftforge/fml/common/network"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/fml/common/network/ByteBufUtils.html"
sourceType: javadoc
---

# ByteBufUtils

## Class signature

```java
public class ByteBufUtils extends java.lang.Object
```

## Constructors

- `public ByteBufUtils()`

## Methods

- `public static int varIntByteCount(int toCount)`
- `public static int readVarInt(io.netty.buffer.ByteBuf buf, int maxSize)`
- `public static int readVarShort(io.netty.buffer.ByteBuf buf)`
- `public static void writeVarShort(io.netty.buffer.ByteBuf buf, int toWrite)`
- `public static void writeVarInt(io.netty.buffer.ByteBuf to, int toWrite, int maxSize)`
- `public static java.lang.String readUTF8String(io.netty.buffer.ByteBuf from)`
- `public static void writeUTF8String(io.netty.buffer.ByteBuf to, java.lang.String string)`
- `public static void writeItemStack(io.netty.buffer.ByteBuf to, ItemStack stack)`
- `public static ItemStack readItemStack(io.netty.buffer.ByteBuf from)`
- `public static void writeTag(io.netty.buffer.ByteBuf to, NBTTagCompound tag)`
- `public static NBTTagCompound readTag(io.netty.buffer.ByteBuf from)`
- `public static java.lang.String getContentDump(io.netty.buffer.ByteBuf buffer)`

## Description

Utilities for interacting with ByteBuf .
