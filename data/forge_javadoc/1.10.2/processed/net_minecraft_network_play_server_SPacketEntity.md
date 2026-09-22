# SPacketEntity

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketEntity

## Class signature

```java
public class SPacketEntity extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketEntity()`
- `SPacketEntity(int entityIdIn)`

## Methods

- `Entity getEntity(World worldIn)`
- `boolean getOnGround()`
- `byte getPitch()`
- `int getX()`
- `int getY()`
- `byte getYaw()`
- `int getZ()`
- `boolean isRotating()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `java.lang.String toString()`
- `void writePacketData(PacketBuffer buf)`

## Fields

- `protected int entityId`
- `protected boolean onGround`
- `protected byte pitch`
- `protected int posX`
- `protected int posY`
- `protected int posZ`
- `protected boolean rotating`
- `protected byte yaw`