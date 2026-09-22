# CPacketAnimation

**Inheritance:** java.lang.Object → net.minecraft.network.play.client.CPacketAnimation

## Class signature

```java
public class CPacketAnimation extends java.lang.Object implements Packet<INetHandlerPlayServer>
```

## Constructors

- `CPacketAnimation()`
- `CPacketAnimation(EnumHand handIn)`

## Methods

- `EnumHand getHand()`
- `void processPacket(INetHandlerPlayServer handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`