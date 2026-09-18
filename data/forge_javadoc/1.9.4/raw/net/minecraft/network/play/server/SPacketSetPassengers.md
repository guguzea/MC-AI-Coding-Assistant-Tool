---
title: "SPacketSetPassengers"
description: "public class SPacketSetPassengers extends java.lang.Object implements Packet < INetHandlerPlayClient >"
package: "net/minecraft/network/play/server"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/network/play/server/SPacketSetPassengers.html"
sourceType: javadoc
---

# SPacketSetPassengers

## Class signature

```java
public class SPacketSetPassengers extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketSetPassengers()`
- `public SPacketSetPassengers( Entity entityIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public int[] getPassengerIds()`
- `public int getEntityId()`
