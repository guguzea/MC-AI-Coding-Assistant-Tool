---
title: "FoodStats"
description: "public class FoodStats extends java.lang.Object"
package: "net/minecraft/util"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/util/FoodStats.html"
sourceType: javadoc
---

# FoodStats

**Inheritance:** java.lang.Object → net.minecraft.util.FoodStats

## Class signature

```java
public class FoodStats extends java.lang.Object
```

## Constructors

- `FoodStats()`

## Methods

- `void addExhaustion(float p_75113_1_)` — adds input to foodExhaustionLevel to a max of 40
- `void addStats(int foodLevelIn, float foodSaturationModifier)` — Add food stats.
- `void addStats(ItemFood foodItem, ItemStack p_151686_2_)`
- `int getFoodLevel()` — Get the player's food level.
- `int getPrevFoodLevel()`
- `float getSaturationLevel()` — Get the player's food saturation level.
- `boolean needFood()` — Get whether the player must eat food.
- `void onUpdate(EntityPlayer player)` — Handles the food game logic.
- `void readNBT(NBTTagCompound p_75112_1_)` — Reads the food data for the player.
- `void setFoodLevel(int foodLevelIn)`
- `void setFoodSaturationLevel(float foodSaturationLevelIn)`
- `void writeNBT(NBTTagCompound p_75117_1_)` — Writes the food data for the player.
