# C16PacketClientStatus

**Inheritance:** java.lang.Object → net.minecraft.network.play.client.C16PacketClientStatus

## Class signature

```java
public class C16PacketClientStatus extends java.lang.Object implements Packet<INetHandlerPlayServer>
```

## Constructors

- `C16PacketClientStatus()`
- `C16PacketClientStatus(C16PacketClientStatus.EnumState statusIn)`

## Methods

- `C16PacketClientStatus.EnumState getStatus()`
- `void processPacket(INetHandlerPlayServer handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.