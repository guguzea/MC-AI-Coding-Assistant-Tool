# BlockEvent.HarvestDropsEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.world.BlockEvent → net.minecraftforge.event.world.BlockEvent.HarvestDropsEvent

## Class signature

```java
public static class BlockEvent.HarvestDropsEvent extends BlockEvent
```

## Constructors

- `HarvestDropsEvent(World world, BlockPos pos, IBlockState state, int fortuneLevel, float dropChance, java.util.List<ItemStack> drops, EntityPlayer harvester, boolean isSilkTouching)`

## Fields

- `float dropChance`
- `java.util.List<ItemStack> drops`
- `int fortuneLevel`
- `EntityPlayer harvester`
- `boolean isSilkTouching`