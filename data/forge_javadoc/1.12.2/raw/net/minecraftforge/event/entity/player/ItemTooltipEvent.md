---
title: "ItemTooltipEvent"
description: "public class ItemTooltipEvent extends PlayerEvent"
package: "net/minecraftforge/event/entity/player"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/event/entity/player/ItemTooltipEvent.html"
sourceType: javadoc
---

# ItemTooltipEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.entity.EntityEvent → net.minecraftforge.event.entity.living.LivingEvent → net.minecraftforge.event.entity.player.PlayerEvent → net.minecraftforge.event.entity.player.ItemTooltipEvent

## Class signature

```java
public class ItemTooltipEvent extends PlayerEvent
```

## Constructors

- `ItemTooltipEvent(ItemStack itemStack, EntityPlayer entityPlayer, java.util.List<java.lang.String> toolTip, ITooltipFlag flags)`

## Methods

- `EntityPlayer getEntityPlayer()` — This event is fired with a null player during startup when populating search trees for tooltips.
- `ITooltipFlag getFlags()` — Use to determine if the advanced information on item tooltips is being shown, toggled by F3+H.
- `ItemStack getItemStack()` — The ItemStack with the tooltip.
- `java.util.List<java.lang.String> getToolTip()` — The ItemStack tooltip.
