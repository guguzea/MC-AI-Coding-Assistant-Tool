---
title: "SPacketEntityAttach"
description: "public class SPacketEntityAttach extends java.lang.Object implements Packet < INetHandlerPlayClient >"
package: "net/minecraft/network/play/server"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/network/play/server/SPacketEntityAttach.html"
sourceType: javadoc
---

# SPacketEntityAttach

## Class signature

```java
public class SPacketEntityAttach extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketEntityAttach()`
- `public SPacketEntityAttach( Entity entityIn, @Nullable Entity vehicleIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public int getEntityId()`
- `public int getVehicleEntityId()`
