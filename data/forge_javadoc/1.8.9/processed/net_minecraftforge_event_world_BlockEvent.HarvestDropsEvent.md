# BlockEvent.HarvestDropsEvent

## Constructors

- `public HarvestDropsEvent( World world, BlockPos pos, IBlockState state, int fortuneLevel, float dropChance, java.util.List< ItemStack > drops, EntityPlayer harvester, boolean isSilkTouching)`

## Description

Fired when a block is about to drop it's harvested items. The drops array can be amended, as can the dropChance . Note well: the harvester player field is null in a variety of scenarios. Code expectin