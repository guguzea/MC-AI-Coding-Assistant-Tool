---
title: "AnvilRepairEvent"
description: "Fired when the player removes a \"repaired\" item from the Anvil's Output slot. breakChance specifies as a percentage the chance that the anvil will be \"damaged\" when used. ItemStacks are the inputs"
package: "net/minecraftforge/event/entity/player"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/event/entity/player/AnvilRepairEvent.html"
sourceType: javadoc
---

# AnvilRepairEvent

## Class signature

```java
public class AnvilRepairEvent extends PlayerEvent
```

## Constructors

- `public AnvilRepairEvent( EntityPlayer player, ItemStack left, ItemStack right, ItemStack output)`

## Methods

- `@Deprecated public ItemStack getLeft()`
- `@Deprecated public ItemStack getRight()`
- `@Deprecated public ItemStack getOutput()`
- `public ItemStack getItemResult()`
- `public ItemStack getItemInput()`
- `public ItemStack getIngredientInput()`
- `public float getBreakChance()`
- `public void setBreakChance(float breakChance)`

## Description

Fired when the player removes a "repaired" item from the Anvil's Output slot. breakChance specifies as a percentage the chance that the anvil will be "damaged" when used. ItemStacks are the inputs/out
