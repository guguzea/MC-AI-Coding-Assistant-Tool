---
title: "ItemTooltipEvent"
description: "This event is fired in ItemStack.getTooltip(EntityPlayer, boolean) , which in turn is called from it's respective GUIContainer."
package: "net/minecraftforge/event/entity/player"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/event/entity/player/ItemTooltipEvent.html"
sourceType: javadoc
---

# ItemTooltipEvent

## Class signature

```java
public class ItemTooltipEvent extends PlayerEvent
```

## Constructors

- `public ItemTooltipEvent( ItemStack itemStack, EntityPlayer entityPlayer, java.util.List<java.lang.String> toolTip, boolean showAdvancedItemTooltips)`

## Methods

- `public boolean isShowAdvancedItemTooltips()`
- `public ItemStack getItemStack()`
- `public java.util.List<java.lang.String> getToolTip()`

## Description

This event is fired in ItemStack.getTooltip(EntityPlayer, boolean) , which in turn is called from it's respective GUIContainer.
