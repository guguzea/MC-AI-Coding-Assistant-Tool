---
title: "BlockEvent.HarvestDropsEvent"
description: "Fired when a block is about to drop it's harvested items. The drops array can be amended, as can the dropChance . Note well: the harvester player field is null in a variety of scenarios. Code expectin"
package: "net/minecraftforge/event/world"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/event/world/BlockEvent.HarvestDropsEvent.html"
sourceType: javadoc
---

# BlockEvent.HarvestDropsEvent

## Constructors

- `public HarvestDropsEvent( World world, BlockPos pos, IBlockState state, int fortuneLevel, float dropChance, java.util.List< ItemStack > drops, EntityPlayer harvester, boolean isSilkTouching)`

## Methods

- `public int getFortuneLevel()`
- `public java.util.List< ItemStack > getDrops()`
- `public boolean isSilkTouching()`
- `public float getDropChance()`
- `public void setDropChance(float dropChance)`
- `public EntityPlayer getHarvester()`

## Description

Fired when a block is about to drop it's harvested items. The drops array can be amended, as can the dropChance . Note well: the harvester player field is null in a variety of scenarios. Code expectin
