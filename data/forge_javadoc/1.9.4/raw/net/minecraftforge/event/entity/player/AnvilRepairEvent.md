---
title: "AnvilRepairEvent"
description: "Fired when the player removes a \"repaired\" item from the Anvil's Output slot."
package: "net/minecraftforge/event/entity/player"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/event/entity/player/AnvilRepairEvent.html"
sourceType: javadoc
---

# AnvilRepairEvent

## Class signature

```java
public class AnvilRepairEvent extends PlayerEvent
```

## Constructors

- `public AnvilRepairEvent( EntityPlayer player, ItemStack output, ItemStack left, ItemStack right)`

## Methods

- `public ItemStack getLeft()`
- `public ItemStack getRight()`
- `public ItemStack getOutput()`
- `public float getBreakChance()`
- `public void setBreakChance(float breakChance)`

## Description

Fired when the player removes a "repaired" item from the Anvil's Output slot.
