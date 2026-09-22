# SPacketHeldItemChange

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketHeldItemChange

## Class signature

```java
public class SPacketHeldItemChange extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketHeldItemChange()`
- `SPacketHeldItemChange(int hotbarIndexIn)`

## Methods

- `int getHeldItemHotbarIndex()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`