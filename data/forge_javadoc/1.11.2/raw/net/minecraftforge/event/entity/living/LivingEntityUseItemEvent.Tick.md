---
title: "LivingEntityUseItemEvent.Tick"
description: "Fired every tick that a player is 'using' an item, see LivingEntityUseItemEvent.Start for info. Cancel the event, or set the duration or <= 0 to cause the player to stop using the item."
package: "net/minecraftforge/event/entity/living"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/event/entity/living/LivingEntityUseItemEvent.Tick.html"
sourceType: javadoc
---

# LivingEntityUseItemEvent.Tick

## Constructors

- `public Tick( EntityLivingBase entity, @Nonnull ItemStack item, int duration)`

## Description

Fired every tick that a player is 'using' an item, see LivingEntityUseItemEvent.Start for info. Cancel the event, or set the duration or <= 0 to cause the player to stop using the item.
