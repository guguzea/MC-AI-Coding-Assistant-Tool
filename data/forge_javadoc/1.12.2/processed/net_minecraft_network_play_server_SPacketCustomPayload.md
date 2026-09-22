# SPacketCustomPayload

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketCustomPayload

## Class signature

```java
public class SPacketCustomPayload extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketCustomPayload()`
- `SPacketCustomPayload(java.lang.String channelIn, PacketBuffer bufIn)`

## Methods

- `PacketBuffer getBufferData()`
- `java.lang.String getChannelName()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`