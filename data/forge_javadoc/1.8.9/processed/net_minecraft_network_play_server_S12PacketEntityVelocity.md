# S12PacketEntityVelocity

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.S12PacketEntityVelocity

## Class signature

```java
public class S12PacketEntityVelocity extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `S12PacketEntityVelocity()`
- `S12PacketEntityVelocity(Entity entityIn)`
- `S12PacketEntityVelocity(int entityIDIn, double motionXIn, double motionYIn, double motionZIn)`

## Methods

- `int getEntityID()`
- `int getMotionX()`
- `int getMotionY()`
- `int getMotionZ()`
- `void processPacket(INetHandlerPlayClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.