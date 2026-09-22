# CPacketCustomPayload

**Inheritance:** java.lang.Object → net.minecraft.network.play.client.CPacketCustomPayload

## Class signature

```java
public class CPacketCustomPayload extends java.lang.Object implements Packet<INetHandlerPlayServer>
```

## Constructors

- `CPacketCustomPayload()`
- `CPacketCustomPayload(java.lang.String channelIn, PacketBuffer bufIn)`

## Methods

- `PacketBuffer getBufferData()`
- `java.lang.String getChannelName()`
- `void processPacket(INetHandlerPlayServer handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`