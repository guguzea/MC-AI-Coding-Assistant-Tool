---
title: "SPacketRemoveEntityEffect"
description: "public class SPacketRemoveEntityEffect extends java.lang.Object implements Packet < INetHandlerPlayClient >"
package: "net/minecraft/network/play/server"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/network/play/server/SPacketRemoveEntityEffect.html"
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
