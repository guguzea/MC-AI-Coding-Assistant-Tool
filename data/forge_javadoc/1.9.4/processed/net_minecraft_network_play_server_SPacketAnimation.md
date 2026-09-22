# SPacketAnimation

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketAnimation

## Class signature

```java
public class SPacketAnimation extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketAnimation()`
- `SPacketAnimation(Entity entityIn, int typeIn)`

## Methods

- `int getAnimationType()`
- `int getEntityID()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`