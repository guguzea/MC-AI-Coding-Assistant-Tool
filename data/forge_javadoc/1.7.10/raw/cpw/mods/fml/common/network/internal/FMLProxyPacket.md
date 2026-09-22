---
title: "FMLProxyPacket"
description: "public class FMLProxyPacket extends Packet"
package: "cpw/mods/fml/common/network/internal"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/common/network/internal/FMLProxyPacket.html"
sourceType: javadoc
---

# FMLProxyPacket

**Inheritance:** java.lang.Object → net.minecraft.network.Packet → cpw.mods.fml.common.network.internal.FMLProxyPacket

## Class signature

```java
public class FMLProxyPacket extends Packet
```

## Constructors

- `FMLProxyPacket(ByteBuf payload, java.lang.String channel)`
- `FMLProxyPacket(C17PacketCustomPayload original)`
- `FMLProxyPacket(S3FPacketCustomPayload original)`

## Methods

- `java.lang.String channel()`
- `NetworkDispatcher getDispatcher()`
- `NetworkManager getOrigin()`
- `Side getTarget()`
- `INetHandler handler()`
- `ByteBuf payload()`
- `void processPacket(INetHandler inethandler)`
- `void readPacketData(PacketBuffer packetbuffer)`
- `void setDispatcher(NetworkDispatcher networkDispatcher)`
- `void setTarget(Side target)`
- `Packet toC17Packet()`
- `Packet toS3FPacket()`
- `void writePacketData(PacketBuffer packetbuffer)`
