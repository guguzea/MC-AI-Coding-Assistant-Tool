# C00PacketServerQuery

**Inheritance:** java.lang.Object → net.minecraft.network.status.client.C00PacketServerQuery

## Class signature

```java
public class C00PacketServerQuery extends java.lang.Object implements Packet<INetHandlerStatusServer>
```

## Constructors

- `C00PacketServerQuery()`

## Methods

- `void processPacket(INetHandlerStatusServer handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.