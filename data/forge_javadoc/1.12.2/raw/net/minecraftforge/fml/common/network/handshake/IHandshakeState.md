---
title: "IHandshakeState"
description: "public interface IHandshakeState<S>"
package: "net/minecraftforge/fml/common/network/handshake"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fml/common/network/handshake/IHandshakeState.html"
sourceType: javadoc
---

# IHandshakeState

## Class signature

```java
public interface IHandshakeState<S>
```

## Methods

- `void accept(ChannelHandlerContext ctx, FMLHandshakeMessage msg, java.util.function.Consumer<? super S> cons)` — Accepts FML handshake message for this state, and if needed - switches to another handshake state using the provided consumer.
