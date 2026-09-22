# FMLProxyPacket

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.network.internal.FMLProxyPacket

## Class signature

```java
public class FMLProxyPacket extends java.lang.Object implements Packet<INetHandler>
```

## Constructors

- `FMLProxyPacket(CPacketCustomPayload original)`
- `FMLProxyPacket(PacketBuffer payload, java.lang.String channel)`
- `FMLProxyPacket(SPacketCustomPayload original)`

## Methods

- `java.lang.String channel()`
- `FMLProxyPacket copy()`
- `NetworkDispatcher getDispatcher()`
- `NetworkManager getOrigin()`
- `Side getTarget()`
- `INetHandler handler()`
- `io.netty.buffer.ByteBuf payload()`
- `void processPacket(INetHandler inethandler)`
- `void readPacketData(PacketBuffer packetbuffer)`
- `void setDispatcher(NetworkDispatcher networkDispatcher)`
- `void setTarget(Side target)`
- `Packet<INetHandlerPlayServer> toC17Packet()`
- `java.util.List<Packet<INetHandlerPlayClient>> toS3FPackets()`
- `void writePacketData(PacketBuffer packetbuffer)`

## Fields

- `static int MAX_LENGTH`