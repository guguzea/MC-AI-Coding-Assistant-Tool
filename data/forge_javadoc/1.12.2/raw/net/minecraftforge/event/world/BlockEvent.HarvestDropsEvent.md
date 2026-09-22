---
title: "BlockEvent.HarvestDropsEvent"
description: "public static class BlockEvent.HarvestDropsEvent extends BlockEvent"
package: "net/minecraftforge/event/world"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/event/world/BlockEvent.HarvestDropsEvent.html"
sourceType: javadoc
---

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
