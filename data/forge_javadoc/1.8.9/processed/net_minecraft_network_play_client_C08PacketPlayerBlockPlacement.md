# C08PacketPlayerBlockPlacement

**Inheritance:** java.lang.Object → net.minecraft.network.play.client.C08PacketPlayerBlockPlacement

## Class signature

```java
public class C08PacketPlayerBlockPlacement extends java.lang.Object implements Packet<INetHandlerPlayServer>
```

## Constructors

- `C08PacketPlayerBlockPlacement()`
- `C08PacketPlayerBlockPlacement(BlockPos positionIn, int placedBlockDirectionIn, ItemStack stackIn, float facingXIn, float facingYIn, float facingZIn)`
- `C08PacketPlayerBlockPlacement(ItemStack stackIn)`

## Methods

- `int getPlacedBlockDirection()`
- `float getPlacedBlockOffsetX()` — Returns the offset from xPosition where the actual click took place.
- `float getPlacedBlockOffsetY()` — Returns the offset from yPosition where the actual click took place.
- `float getPlacedBlockOffsetZ()` — Returns the offset from zPosition where the actual click took place.
- `BlockPos getPosition()`
- `ItemStack getStack()`
- `void processPacket(INetHandlerPlayServer handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.