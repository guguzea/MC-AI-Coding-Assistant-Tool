# BlockEvent.HarvestDropsEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.world.BlockEvent → net.minecraftforge.event.world.BlockEvent.HarvestDropsEvent

## Class signature

```java
public static class BlockEvent.HarvestDropsEvent extends BlockEvent
```

## Constructors

- `HarvestDropsEvent(World world, BlockPos pos, IBlockState state, int fortuneLevel, float dropChance, java.util.List<ItemStack> drops, EntityPlayer harvester, boolean isSilkTouching)`

## Methods

- `float getDropChance()`
- `java.util.List<ItemStack> getDrops()`
- `int getFortuneLevel()`
- `EntityPlayer getHarvester()`
- `boolean isSilkTouching()`
- `void setDropChance(float dropChance)`