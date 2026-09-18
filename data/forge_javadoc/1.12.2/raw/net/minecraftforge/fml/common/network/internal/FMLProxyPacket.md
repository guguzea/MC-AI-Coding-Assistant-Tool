---
title: "FMLProxyPacket"
description: "public class FMLProxyPacket extends java.lang.Object implements Packet < INetHandler >"
package: "net/minecraftforge/fml/common/network/internal"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fml/common/network/internal/FMLProxyPacket.html"
sourceType: javadoc
---

# FMLProxyPacket

## Class signature

```java
public class FMLProxyPacket extends java.lang.Object implements Packet < INetHandler >
```

## Constructors

- `public FMLProxyPacket( SPacketCustomPayload original)`
- `public FMLProxyPacket( CPacketCustomPayload original)`
- `public FMLProxyPacket( PacketBuffer payload, java.lang.String channel)`

## Methods

- `public void readPacketData( PacketBuffer packetbuffer) throws java.io.IOException`
- `public void writePacketData( PacketBuffer packetbuffer) throws java.io.IOException`
- `public void processPacket( INetHandler inethandler)`
- `public java.lang.String channel()`
- `public ByteBuf payload()`
- `public INetHandler handler()`
- `public Packet < INetHandlerPlayServer > toC17Packet()`
- `public java.util.List< Packet < INetHandlerPlayClient >> toS3FPackets() throws java.io.IOException`
- `public void setTarget( Side target)`
- `public void setDispatcher( NetworkDispatcher networkDispatcher)`
- `public NetworkManager getOrigin()`
- `public NetworkDispatcher getDispatcher()`
- `public Side getTarget()`
- `public FMLProxyPacket copy()`
