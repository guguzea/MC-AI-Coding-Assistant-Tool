---
title: "PacketUtil"
description: "public class PacketUtil extends java.lang.Object"
package: "net/minecraftforge/common/util"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/common/util/PacketUtil.html"
sourceType: javadoc
---

# PacketUtil

**Inheritance:** java.lang.Object → net.minecraftforge.common.util.PacketUtil

## Class signature

```java
public class PacketUtil extends java.lang.Object
```

## Methods

- `static void writeItemStackFromClientToServer(PacketBuffer buffer, ItemStack stack)` — Most ItemStack serialization is Server to Client, and must go through PacketBuffer.writeItemStack which uses Item.getNBTShareTag.
