# SPacketEntityVelocity

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketEntityVelocity

## Class signature

```java
public class SPacketEntityVelocity extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketEntityVelocity()`
- `SPacketEntityVelocity(Entity entityIn)`
- `SPacketEntityVelocity(int entityIdIn, double motionXIn, double motionYIn, double motionZIn)`

## Methods

- `int getEntityID()`
- `int getMotionX()`
- `int getMotionY()`
- `int getMotionZ()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`