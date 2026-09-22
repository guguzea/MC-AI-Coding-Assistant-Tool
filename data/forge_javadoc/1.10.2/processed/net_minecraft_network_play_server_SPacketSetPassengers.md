# SPacketSetPassengers

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketSetPassengers

## Class signature

```java
public class SPacketSetPassengers extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketSetPassengers()`
- `SPacketSetPassengers(Entity entityIn)`

## Methods

- `int getEntityId()`
- `int[] getPassengerIds()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`