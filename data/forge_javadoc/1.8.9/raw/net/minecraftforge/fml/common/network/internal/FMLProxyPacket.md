---
title: "FMLProxyPacket"
description: "public class FMLProxyPacket extends java.lang.Object implements Packet<INetHandler>"
package: "net/minecraftforge/fml/common/network/internal"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/fml/common/network/internal/FMLProxyPacket.html"
sourceType: javadoc
---

# FMLProxyPacket

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.network.internal.FMLProxyPacket

## Class signature

```java
public class FMLProxyPacket extends java.lang.Object implements Packet<INetHandler>
```

## Constructors

- `FMLProxyPacket(C17PacketCustomPayload original)`
- `FMLProxyPacket(PacketBuffer payload, java.lang.String channel)`
- `FMLProxyPacket(S3FPacketCustomPayload original)`

## Methods

- `java.lang.String channel()`
- `FMLProxyPacket copy()`
- `NetworkDispatcher getDispatcher()`
- `NetworkManager getOrigin()`
- `Side getTarget()`
- `INetHandler handler()`
- `ByteBuf payload()`
- `void processPacket(INetHandler inethandler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer packetbuffer)` — Reads the raw packet data from the data stream.
- `void setDispatcher(NetworkDispatcher networkDispatcher)`
- `void setTarget(Side target)`
- `Packet<INetHandlerPlayServer> toC17Packet()`
- `java.util.List<Packet<INetHandlerPlayClient>> toS3FPackets()`
- `void writePacketData(PacketBuffer packetbuffer)` — Writes the raw packet data to the data stream.

## Fields

- `static int MAX_LENGTH`
