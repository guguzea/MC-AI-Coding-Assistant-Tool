# C17PacketCustomPayload

**Inheritance:** java.lang.Object → net.minecraft.network.play.client.C17PacketCustomPayload

## Class signature

```java
public class C17PacketCustomPayload extends java.lang.Object implements Packet<INetHandlerPlayServer>
```

## Constructors

- `C17PacketCustomPayload()`
- `C17PacketCustomPayload(java.lang.String channelIn, PacketBuffer dataIn)`

## Methods

- `PacketBuffer getBufferData()`
- `java.lang.String getChannelName()`
- `void processPacket(INetHandlerPlayServer handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.