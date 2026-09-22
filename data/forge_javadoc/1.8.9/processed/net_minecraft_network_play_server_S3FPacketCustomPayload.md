# S3FPacketCustomPayload

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.S3FPacketCustomPayload

## Class signature

```java
public class S3FPacketCustomPayload extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `S3FPacketCustomPayload()`
- `S3FPacketCustomPayload(java.lang.String channelName, PacketBuffer dataIn)`

## Methods

- `PacketBuffer getBufferData()`
- `java.lang.String getChannelName()`
- `void processPacket(INetHandlerPlayClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.