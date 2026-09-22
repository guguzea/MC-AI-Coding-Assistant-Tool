# SPacketWorldBorder

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketWorldBorder

## Class signature

```java
public class SPacketWorldBorder extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketWorldBorder()`
- `SPacketWorldBorder(WorldBorder border, SPacketWorldBorder.Action actionIn)`

## Methods

- `void apply(WorldBorder border)`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`