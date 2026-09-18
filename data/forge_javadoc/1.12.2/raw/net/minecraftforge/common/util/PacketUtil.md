---
title: "PacketUtil"
description: "Most ItemStack serialization is Server to Client, and must go through PacketBuffer.writeItemStack which uses Item.getNBTShareTag."
package: "net/minecraftforge/common/util"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/common/util/PacketUtil.html"
sourceType: javadoc
---

# PacketUtil

## Class signature

```java
public class PacketUtil extends java.lang.Object
```

## Methods

- `public static void writeItemStackFromClientToServer( PacketBuffer buffer, ItemStack stack)`

## Description

Most ItemStack serialization is Server to Client, and must go through PacketBuffer.writeItemStack which uses Item.getNBTShareTag.
