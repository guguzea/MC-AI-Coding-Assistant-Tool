---
title: "IMessage"
description: "public interface IMessage"
package: "cpw/mods/fml/common/network/simpleimpl"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/common/network/simpleimpl/IMessage.html"
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
