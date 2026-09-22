# C0CPacketInput

**Inheritance:** java.lang.Object → net.minecraft.network.play.client.C0CPacketInput

## Class signature

```java
public class C0CPacketInput extends java.lang.Object implements Packet<INetHandlerPlayServer>
```

## Constructors

- `C0CPacketInput()`
- `C0CPacketInput(float strafeSpeed, float forwardSpeed, boolean jumping, boolean sneaking)`

## Methods

- `float getForwardSpeed()`
- `float getStrafeSpeed()`
- `boolean isJumping()`
- `boolean isSneaking()`
- `void processPacket(INetHandlerPlayServer handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.