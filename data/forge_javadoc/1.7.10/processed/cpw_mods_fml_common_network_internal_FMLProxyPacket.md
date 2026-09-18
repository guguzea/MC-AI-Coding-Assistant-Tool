# FMLProxyPacket

## Class signature

```java
public class FMLProxyPacket extends Packet
```

## Constructors

- `public FMLProxyPacket( S3FPacketCustomPayload original)`
- `public FMLProxyPacket( C17PacketCustomPayload original)`
- `public FMLProxyPacket(ByteBuf payload, java.lang.String channel)`

## Methods

- `public void readPacketData( PacketBuffer packetbuffer) throws java.io.IOException`
- `public void writePacketData( PacketBuffer packetbuffer) throws java.io.IOException`
- `public void processPacket( INetHandler inethandler)`
- `public java.lang.String channel()`
- `public ByteBuf payload()`
- `public INetHandler handler()`
- `public Packet toC17Packet()`
- `public Packet toS3FPacket()`
- `public void setTarget( Side target)`
- `public void setDispatcher( NetworkDispatcher networkDispatcher)`
- `public NetworkManager getOrigin()`
- `public NetworkDispatcher getDispatcher()`
- `public Side getTarget()`