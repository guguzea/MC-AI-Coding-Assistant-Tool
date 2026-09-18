---
title: "FoodStats"
description: "adds input to foodExhaustionLevel to a max of 40"
package: "net/minecraft/util"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/util/FoodStats.html"
sourceType: javadoc
---

# FoodStats

## Class signature

```java
public class FoodStats extends java.lang.Object
```

## Constructors

- `public FoodStats()`

## Methods

- `public void addStats(int foodLevelIn, float foodSaturationModifier)`
- `public void addStats( ItemFood foodItem, ItemStack p_151686_2_)`
- `public void onUpdate( EntityPlayer player)`
- `public void readNBT( NBTTagCompound p_75112_1_)`
- `public void writeNBT( NBTTagCompound p_75117_1_)`
- `public int getFoodLevel()`
- `public int getPrevFoodLevel()`
- `public boolean needFood()`
- `public void addExhaustion(float p_75113_1_)`
- `public float getSaturationLevel()`
- `public void setFoodLevel(int foodLevelIn)`
- `public void setFoodSaturationLevel(float foodSaturationLevelIn)`

## Description

adds input to foodExhaustionLevel to a max of 40
