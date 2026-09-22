# CPacketEntityAction

**Inheritance:** java.lang.Object → net.minecraft.network.play.client.CPacketEntityAction

## Class signature

```java
public class CPacketEntityAction extends java.lang.Object implements Packet<INetHandlerPlayServer>
```

## Constructors

- `CPacketEntityAction()`
- `CPacketEntityAction(Entity entityIn, CPacketEntityAction.Action actionIn)`
- `CPacketEntityAction(Entity entityIn, CPacketEntityAction.Action actionIn, int auxDataIn)`

## Methods

- `CPacketEntityAction.Action getAction()`
- `int getAuxData()`
- `void processPacket(INetHandlerPlayServer handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`