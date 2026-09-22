# CPacketUseEntity

**Inheritance:** java.lang.Object → net.minecraft.network.play.client.CPacketUseEntity

## Class signature

```java
public class CPacketUseEntity extends java.lang.Object implements Packet<INetHandlerPlayServer>
```

## Constructors

- `CPacketUseEntity()`
- `CPacketUseEntity(Entity entityIn)`
- `CPacketUseEntity(Entity entityIn, EnumHand handIn)`
- `CPacketUseEntity(Entity entityIn, EnumHand handIn, Vec3d hitVecIn)`

## Methods

- `CPacketUseEntity.Action getAction()`
- `Entity getEntityFromWorld(World worldIn)`
- `EnumHand getHand()`
- `Vec3d getHitVec()`
- `void processPacket(INetHandlerPlayServer handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`