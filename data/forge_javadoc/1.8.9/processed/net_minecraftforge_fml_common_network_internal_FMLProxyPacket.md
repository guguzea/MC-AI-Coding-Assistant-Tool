# FMLProxyPacket

## Class signature

```java
public class FMLProxyPacket extends java.lang.Object implements Packet < INetHandler >
```

## Constructors

- `public FMLProxyPacket( S3FPacketCustomPayload original)`
- `public FMLProxyPacket( C17PacketCustomPayload original)`
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

## Description

Passes this Packet on to the NetHandler for processing.