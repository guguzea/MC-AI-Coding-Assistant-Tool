# BlockEvent.PlaceEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.world.BlockEvent → net.minecraftforge.event.world.BlockEvent.PlaceEvent

## Class signature

```java
public static class BlockEvent.PlaceEvent extends BlockEvent
```

## Constructors

- `@Deprecated PlaceEvent(BlockSnapshot blockSnapshot, IBlockState placedAgainst, EntityPlayer player)`
- `PlaceEvent(BlockSnapshot blockSnapshot, IBlockState placedAgainst, EntityPlayer player, EnumHand hand)`

## Methods

- `BlockSnapshot getBlockSnapshot()`
- `EnumHand getHand()`
- `@Deprecated ItemStack getItemInHand()`
- `IBlockState getPlacedAgainst()`
- `IBlockState getPlacedBlock()`
- `EntityPlayer getPlayer()`