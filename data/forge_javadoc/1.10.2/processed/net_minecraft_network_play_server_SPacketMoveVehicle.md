# SPacketMoveVehicle

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketMoveVehicle

## Class signature

```java
public class SPacketMoveVehicle extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketMoveVehicle()`
- `SPacketMoveVehicle(Entity entityIn)`

## Methods

- `float getPitch()`
- `double getX()`
- `double getY()`
- `float getYaw()`
- `double getZ()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`