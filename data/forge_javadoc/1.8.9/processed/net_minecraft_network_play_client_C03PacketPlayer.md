# C03PacketPlayer

**Inheritance:** java.lang.Object → net.minecraft.network.play.client.C03PacketPlayer

## Class signature

```java
public class C03PacketPlayer extends java.lang.Object implements Packet<INetHandlerPlayServer>
```

## Constructors

- `C03PacketPlayer()`
- `C03PacketPlayer(boolean isOnGround)`

## Methods

- `float getPitch()`
- `double getPositionX()`
- `double getPositionY()`
- `double getPositionZ()`
- `boolean getRotating()`
- `float getYaw()`
- `boolean isMoving()`
- `boolean isOnGround()`
- `void processPacket(INetHandlerPlayServer handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void setMoving(boolean isMoving)`
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.

## Fields

- `protected boolean moving`
- `protected boolean onGround`
- `protected float pitch`
- `protected boolean rotating`
- `protected double x`
- `protected double y`
- `protected float yaw`
- `protected double z`