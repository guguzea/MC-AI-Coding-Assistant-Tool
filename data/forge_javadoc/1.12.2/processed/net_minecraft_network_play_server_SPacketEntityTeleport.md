# SPacketEntityTeleport

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketEntityTeleport

## Class signature

```java
public class SPacketEntityTeleport extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketEntityTeleport()`
- `SPacketEntityTeleport(Entity entityIn)`

## Methods

- `int getEntityId()`
- `boolean getOnGround()`
- `byte getPitch()`
- `double getX()`
- `double getY()`
- `byte getYaw()`
- `double getZ()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`