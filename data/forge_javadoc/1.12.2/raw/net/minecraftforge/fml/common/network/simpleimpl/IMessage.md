---
title: "IMessage"
description: "public interface IMessage"
package: "net/minecraftforge/fml/common/network/simpleimpl"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fml/common/network/simpleimpl/IMessage.html"
sourceType: javadoc
---

# IMessage

## Class signature

```java
public interface IMessage
```

## Methods

- `void fromBytes(ByteBuf buf)` — Convert from the supplied buffer into your specific message type
- `void toBytes(ByteBuf buf)` — Deconstruct your message into the supplied byte buffer
