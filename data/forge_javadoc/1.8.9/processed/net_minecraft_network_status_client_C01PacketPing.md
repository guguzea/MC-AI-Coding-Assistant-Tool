# C01PacketPing

**Inheritance:** java.lang.Object → net.minecraft.network.status.client.C01PacketPing

## Class signature

```java
public class C01PacketPing extends java.lang.Object implements Packet<INetHandlerStatusServer>
```

## Constructors

- `C01PacketPing()`
- `C01PacketPing(long ping)`

## Methods

- `long getClientTime()`
- `void processPacket(INetHandlerStatusServer handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.