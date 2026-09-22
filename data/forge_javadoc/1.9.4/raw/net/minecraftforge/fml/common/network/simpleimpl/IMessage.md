---
title: "IMessage"
description: "public interface IMessage"
package: "net/minecraftforge/fml/common/network/simpleimpl"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/fml/common/network/simpleimpl/IMessage.html"
sourceType: javadoc
---

# IMessage

## Class signature

```java
public interface IMessage
```

## Methods

- `void fromBytes(io.netty.buffer.ByteBuf buf)` — Convert from the supplied buffer into your specific message type
- `void toBytes(io.netty.buffer.ByteBuf buf)` — Deconstruct your message into the supplied byte buffer
