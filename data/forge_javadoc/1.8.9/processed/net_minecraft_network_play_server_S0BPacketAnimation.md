# S0BPacketAnimation

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.S0BPacketAnimation

## Class signature

```java
public class S0BPacketAnimation extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `S0BPacketAnimation()`
- `S0BPacketAnimation(Entity ent, int animationType)`

## Methods

- `int getAnimationType()`
- `int getEntityID()`
- `void processPacket(INetHandlerPlayClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.