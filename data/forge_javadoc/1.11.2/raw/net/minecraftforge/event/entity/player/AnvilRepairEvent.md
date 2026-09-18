---
title: "AnvilRepairEvent"
description: "Fired when the player removes a \"repaired\" item from the Anvil's Output slot. breakChance specifies as a percentage the chance that the anvil will be \"damaged\" when used. ItemStacks are the inputs"
package: "net/minecraftforge/event/entity/player"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/event/entity/player/AnvilRepairEvent.html"
sourceType: javadoc
---

# AnvilRepairEvent

## Class signature

```java
public class AnvilRepairEvent extends PlayerEvent
```

## Constructors

- `public AnvilRepairEvent( EntityPlayer player, @Nonnull ItemStack left, @Nonnull ItemStack right, @Nonnull ItemStack output)`

## Methods

- `@Deprecated @Nonnull public ItemStack getLeft()`
- `@Deprecated @Nonnull public ItemStack getRight()`
- `@Deprecated @Nonnull public ItemStack getOutput()`
- `@Nonnull public ItemStack getItemResult()`
- `@Nonnull public ItemStack getItemInput()`
- `@Nonnull public ItemStack getIngredientInput()`
- `public float getBreakChance()`
- `public void setBreakChance(float breakChance)`

## Description

Fired when the player removes a "repaired" item from the Anvil's Output slot. breakChance specifies as a percentage the chance that the anvil will be "damaged" when used. ItemStacks are the inputs/out
