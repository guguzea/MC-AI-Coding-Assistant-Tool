---
title: "BlockEvent.HarvestDropsEvent"
description: "Fired when a block is about to drop it's harvested items. The drops array can be amended, as can the dropChance . Note well: the harvester player field is null in a variety of scenarios. Code expectin"
package: "net/minecraftforge/event/world"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/event/world/BlockEvent.HarvestDropsEvent.html"
sourceType: javadoc
---

# BlockEvent.HarvestDropsEvent

## Constructors

- `public HarvestDropsEvent( World world, BlockPos pos, IBlockState state, int fortuneLevel, float dropChance, java.util.List< ItemStack > drops, EntityPlayer harvester, boolean isSilkTouching)`

## Description

Fired when a block is about to drop it's harvested items. The drops array can be amended, as can the dropChance . Note well: the harvester player field is null in a variety of scenarios. Code expectin
