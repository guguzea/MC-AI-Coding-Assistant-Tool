---
title: "CreativeCrafting"
description: "public class CreativeCrafting extends java.lang.Object implements IContainerListener"
package: "net/minecraft/client/gui/inventory"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/client/gui/inventory/CreativeCrafting.html"
sourceType: javadoc
---

# CreativeCrafting

## Class signature

```java
public class CreativeCrafting extends java.lang.Object implements IContainerListener
```

## Constructors

- `public CreativeCrafting( Minecraft mc)`

## Methods

- `public void updateCraftingInventory( Container containerToSend, NonNullList < ItemStack > itemsList)`
- `public void sendSlotContents( Container containerToSend, int slotInd, ItemStack stack)`
- `public void sendProgressBarUpdate( Container containerIn, int varToUpdate, int newValue)`
- `public void sendAllWindowProperties( Container containerIn, IInventory inventory)`
