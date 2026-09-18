---
title: "LivingEntityUseItemEvent.Finish"
description: "Fired after an item has fully finished being used. The item has been notified that it was used, and the item/result stacks reflect after that state. This means that when this is fired for a Potion, th"
package: "net/minecraftforge/event/entity/living"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/event/entity/living/LivingEntityUseItemEvent.Finish.html"
sourceType: javadoc
---

# LivingEntityUseItemEvent.Finish

## Constructors

- `public Finish( EntityLivingBase entity, @Nonnull ItemStack item, int duration, @Nonnull ItemStack result)`

## Methods

- `@Nonnull public ItemStack getResultStack()`
- `public void setResultStack(@Nonnull ItemStack result)`

## Description

Fired after an item has fully finished being used. The item has been notified that it was used, and the item/result stacks reflect after that state. This means that when this is fired for a Potion, th
