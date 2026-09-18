---
title: "SPacketRemoveEntityEffect"
description: "public class SPacketRemoveEntityEffect extends java.lang.Object implements Packet < INetHandlerPlayClient >"
package: "net/minecraft/network/play/server"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/network/play/server/SPacketRemoveEntityEffect.html"
sourceType: javadoc
---

# SPacketRemoveEntityEffect

## Class signature

```java
public class SPacketRemoveEntityEffect extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketRemoveEntityEffect()`
- `public SPacketRemoveEntityEffect(int entityIdIn, Potion potionIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `@Nullable public Entity getEntity( World worldIn)`
- `@Nullable public Potion getPotion()`
