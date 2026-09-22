---
title: "ByteBufUtils"
description: "public class ByteBufUtils extends java.lang.Object"
package: "net/minecraftforge/fml/common/network"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/fml/common/network/ByteBufUtils.html"
sourceType: javadoc
---

# ByteBufUtils

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.network.ByteBufUtils

## Class signature

```java
public class ByteBufUtils extends java.lang.Object
```

## Constructors

- `ByteBufUtils()`

## Methods

- `static java.lang.String getContentDump(io.netty.buffer.ByteBuf buffer)`
- `static ItemStack readItemStack(io.netty.buffer.ByteBuf from)` — Read an ItemStack from the byte buffer provided.
- `static NBTTagCompound readTag(io.netty.buffer.ByteBuf from)` — Read an NBTTagCompound from the byte buffer.
- `static java.lang.String readUTF8String(io.netty.buffer.ByteBuf from)` — Read a UTF8 string from the byte buffer.
- `static int readVarInt(io.netty.buffer.ByteBuf buf, int maxSize)` — Read a varint from the supplied buffer.
- `static int readVarShort(io.netty.buffer.ByteBuf buf)` — An extended length short.
- `static int varIntByteCount(int toCount)` — The number of bytes to write the supplied int using the 7 bit varint encoding.
- `static void writeItemStack(io.netty.buffer.ByteBuf to, ItemStack stack)` — Write an ItemStack using minecraft compatible encoding.
- `static void writeTag(io.netty.buffer.ByteBuf to, NBTTagCompound tag)` — Write an NBTTagCompound to the byte buffer.
- `static void writeUTF8String(io.netty.buffer.ByteBuf to, java.lang.String string)` — Write a String with UTF8 byte encoding to the buffer.
- `static void writeVarInt(io.netty.buffer.ByteBuf to, int toWrite, int maxSize)` — Write an integer to the buffer using variable length encoding.
- `static void writeVarShort(io.netty.buffer.ByteBuf buf, int toWrite)`
