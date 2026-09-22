# SPacketEntityStatus

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketEntityStatus

## Class signature

```java
public class SPacketEntityStatus extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketEntityStatus()`
- `SPacketEntityStatus(Entity entityIn, byte opcodeIn)`

## Methods

- `Entity getEntity(World worldIn)`
- `byte getOpCode()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`