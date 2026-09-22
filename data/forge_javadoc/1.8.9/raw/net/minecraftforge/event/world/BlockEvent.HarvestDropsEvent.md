---
title: "BlockEvent.HarvestDropsEvent"
description: "public static class BlockEvent.HarvestDropsEvent extends BlockEvent"
package: "net/minecraftforge/event/world"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/event/world/BlockEvent.HarvestDropsEvent.html"
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

## Fields

- `float dropChance`
- `java.util.List<ItemStack> drops`
- `int fortuneLevel`
- `EntityPlayer harvester`
- `boolean isSilkTouching`
