# CPacketVehicleMove

**Inheritance:** java.lang.Object → net.minecraft.network.play.client.CPacketVehicleMove

## Class signature

```java
public class CPacketVehicleMove extends java.lang.Object implements Packet<INetHandlerPlayServer>
```

## Constructors

- `CPacketVehicleMove()`
- `CPacketVehicleMove(Entity entityIn)`

## Methods

- `float getPitch()`
- `double getX()`
- `double getY()`
- `float getYaw()`
- `double getZ()`
- `void processPacket(INetHandlerPlayServer handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`