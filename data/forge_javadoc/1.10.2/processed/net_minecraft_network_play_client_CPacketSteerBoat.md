# CPacketSteerBoat

**Inheritance:** java.lang.Object → net.minecraft.network.play.client.CPacketSteerBoat

## Class signature

```java
public class CPacketSteerBoat extends java.lang.Object implements Packet<INetHandlerPlayServer>
```

## Constructors

- `CPacketSteerBoat()`
- `CPacketSteerBoat(boolean p_i46873_1_, boolean p_i46873_2_)`

## Methods

- `boolean getLeft()`
- `boolean getRight()`
- `void processPacket(INetHandlerPlayServer handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`