# C19PacketResourcePackStatus

**Inheritance:** java.lang.Object → net.minecraft.network.play.client.C19PacketResourcePackStatus

## Class signature

```java
public class C19PacketResourcePackStatus extends java.lang.Object implements Packet<INetHandlerPlayServer>
```

## Constructors

- `C19PacketResourcePackStatus()`
- `C19PacketResourcePackStatus(java.lang.String hashIn, C19PacketResourcePackStatus.Action statusIn)`

## Methods

- `void processPacket(INetHandlerPlayServer handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.