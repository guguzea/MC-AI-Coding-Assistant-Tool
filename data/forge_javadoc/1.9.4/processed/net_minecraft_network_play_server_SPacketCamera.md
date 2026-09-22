# SPacketCamera

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketCamera

## Class signature

```java
public class SPacketCamera extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketCamera()`
- `SPacketCamera(Entity entityIn)`

## Methods

- `Entity getEntity(World worldIn)`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`

## Fields

- `int entityId`