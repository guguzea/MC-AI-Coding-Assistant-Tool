---
title: "StatList"
description: "public class StatList extends java.lang.Object"
package: "net/minecraft/stats"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/stats/StatList.html"
sourceType: javadoc
---

# StatList

**Inheritance:** java.lang.Object → net.minecraft.stats.StatList

## Class signature

```java
public class StatList extends java.lang.Object
```

## Constructors

- `StatList()`

## Methods

- `static StatBase getBlockStats(Block blockIn)`
- `static StatBase getCraftStats(Item itemIn)`
- `static StatBase getDroppedObjectStats(Item itemIn)`
- `static StatBase getObjectBreakStats(Item itemIn)`
- `static StatBase getObjectsPickedUpStats(Item itemIn)`
- `static StatBase getObjectUseStats(Item itemIn)`
- `static StatBase getOneShotStat(java.lang.String statName)`
- `static StatBase getStatEntityKilledBy(EntityList.EntityEggInfo eggInfo)`
- `static StatBase getStatKillEntity(EntityList.EntityEggInfo eggInfo)`
- `static void init()`
- `@Deprecated static void reinit()`

## Fields

- `static java.util.List<StatBase> ALL_STATS`
- `static StatBase ANIMALS_BRED`
- `static StatBase ARMOR_CLEANED`
- `static StatBase AVIATE_ONE_CM`
- `static StatBase BANNER_CLEANED`
- `static java.util.List<StatBase> BASIC_STATS`
- `static StatBase BEACON_INTERACTION`
- `static StatBase BOAT_ONE_CM`
- `static StatBase BREWINGSTAND_INTERACTION`
- `static StatBase CAKE_SLICES_EATEN`
- `static StatBase CAULDRON_FILLED`
- `static StatBase CAULDRON_USED`
- `static StatBase CHEST_OPENED`
- `static StatBase CLIMB_ONE_CM`
- `static StatBase CRAFTING_TABLE_INTERACTION`
- `static StatBase CROUCH_ONE_CM`
- `static StatBase DAMAGE_DEALT`
- `static StatBase DAMAGE_TAKEN`
- `static StatBase DEATHS`
- `static StatBase DISPENSER_INSPECTED`
- `static StatBase DIVE_ONE_CM`
- `static StatBase DROP`
- `static StatBase DROPPER_INSPECTED`
- `static StatBase ENDERCHEST_OPENED`
- `static StatBase FALL_ONE_CM`
- `static StatBase FISH_CAUGHT`
- `static StatBase FLOWER_POTTED`
- `static StatBase FLY_ONE_CM`
- `static StatBase FURNACE_INTERACTION`
- `static StatBase HOPPER_INSPECTED`
- `static StatBase HORSE_ONE_CM`
- `protected static java.util.Map<java.lang.String, StatBase> ID_TO_STAT_MAP`
- `static StatBase ITEM_ENCHANTED`
- `static StatBase JUMP`
- `static StatBase LEAVE_GAME`
- `static java.util.List<StatCrafting> MINE_BLOCK_STATS`
- `static StatBase MINECART_ONE_CM`
- `static StatBase MOB_KILLS`
- `static StatBase NOTEBLOCK_PLAYED`
- `static StatBase NOTEBLOCK_TUNED`
- `static StatBase OPEN_SHULKER_BOX`
- `static StatBase PIG_ONE_CM`
- `static StatBase PLAY_ONE_MINUTE`
- `static StatBase PLAYER_KILLS`
- `static StatBase RECORD_PLAYED`
- `static StatBase SLEEP_IN_BED`
- `static StatBase SNEAK_TIME`
- `static StatBase SPRINT_ONE_CM`
- `static StatBase SWIM_ONE_CM`
- `static StatBase TALKED_TO_VILLAGER`
- `static StatBase TIME_SINCE_DEATH`
- `static StatBase TRADED_WITH_VILLAGER`
- `static StatBase TRAPPED_CHEST_TRIGGERED`
- `static java.util.List<StatCrafting> USE_ITEM_STATS`
- `static StatBase WALK_ONE_CM`
