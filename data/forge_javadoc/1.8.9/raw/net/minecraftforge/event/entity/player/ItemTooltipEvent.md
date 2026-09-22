---
title: "ItemTooltipEvent"
description: "public class ItemTooltipEvent extends PlayerEvent"
package: "net/minecraftforge/event/entity/player"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/event/entity/player/ItemTooltipEvent.html"
sourceType: javadoc
---

# ItemTooltipEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.entity.EntityEvent → net.minecraftforge.event.entity.living.LivingEvent → net.minecraftforge.event.entity.player.PlayerEvent → net.minecraftforge.event.entity.player.ItemTooltipEvent

## Class signature

```java
public class ItemTooltipEvent extends PlayerEvent
```

## Constructors

- `ItemTooltipEvent(ItemStack itemStack, EntityPlayer entityPlayer, java.util.List<java.lang.String> toolTip, boolean showAdvancedItemTooltips)`

## Fields

- `ItemStack itemStack` — The ItemStack with the tooltip.
- `boolean showAdvancedItemTooltips` — Whether the advanced information on item tooltips is being shown, toggled by F3+H.
- `java.util.List<java.lang.String> toolTip` — The ItemStack tooltip.
