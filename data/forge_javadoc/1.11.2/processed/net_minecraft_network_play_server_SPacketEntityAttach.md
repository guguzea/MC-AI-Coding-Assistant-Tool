# SPacketEntityAttach

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketEntityAttach

## Class signature

```java
public class SPacketEntityAttach extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketEntityAttach()`
- `SPacketEntityAttach(Entity entityIn, Entity vehicleIn)`

## Methods

- `int getEntityId()`
- `int getVehicleEntityId()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`