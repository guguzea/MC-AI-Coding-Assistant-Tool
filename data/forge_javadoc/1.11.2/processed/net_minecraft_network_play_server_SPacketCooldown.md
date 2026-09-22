# SPacketCooldown

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketCooldown

## Class signature

```java
public class SPacketCooldown extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketCooldown()`
- `SPacketCooldown(Item itemIn, int ticksIn)`

## Methods

- `Item getItem()`
- `int getTicks()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`