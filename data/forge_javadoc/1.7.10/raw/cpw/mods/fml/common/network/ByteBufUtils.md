---
title: "ByteBufUtils"
description: "Utilities for interacting with ByteBuf ."
package: "cpw/mods/fml/common/network"
version: "1.7.10"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/common/network/ByteBufUtils.html"
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
- `public static int readVarInt(ByteBuf buf, int maxSize)`
- `public static int readVarShort(ByteBuf buf)`
- `public static void writeVarShort(ByteBuf buf, int toWrite)`
- `public static void writeVarInt(ByteBuf to, int toWrite, int maxSize)`
- `public static java.lang.String readUTF8String(ByteBuf from)`
- `public static void writeUTF8String(ByteBuf to, java.lang.String string)`
- `public static void writeItemStack(ByteBuf to, ItemStack stack)`
- `public static ItemStack readItemStack(ByteBuf from)`
- `public static void writeTag(ByteBuf to, NBTTagCompound tag)`
- `public static NBTTagCompound readTag(ByteBuf from)`
- `public static java.lang.String getContentDump(ByteBuf buffer)`

## Description

Utilities for interacting with ByteBuf .
