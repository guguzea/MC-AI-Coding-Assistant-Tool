# C0APacketAnimation

**Inheritance:** java.lang.Object → net.minecraft.network.play.client.C0APacketAnimation

## Class signature

```java
public class C0APacketAnimation extends java.lang.Object implements Packet<INetHandlerPlayServer>
```

## Constructors

- `C0APacketAnimation()`

## Methods

- `void processPacket(INetHandlerPlayServer handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.