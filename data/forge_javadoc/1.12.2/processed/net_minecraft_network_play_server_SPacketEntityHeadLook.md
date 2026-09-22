# SPacketEntityHeadLook

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketEntityHeadLook

## Class signature

```java
public class SPacketEntityHeadLook extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketEntityHeadLook()`
- `SPacketEntityHeadLook(Entity entityIn, byte yawIn)`

## Methods

- `Entity getEntity(World worldIn)`
- `byte getYaw()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`