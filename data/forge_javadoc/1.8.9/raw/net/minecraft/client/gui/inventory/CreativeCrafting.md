---
title: "CreativeCrafting"
description: "Sends two ints to the client-side Container."
package: "net/minecraft/client/gui/inventory"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/gui/inventory/CreativeCrafting.html"
sourceType: javadoc
---

# CreativeCrafting

## Class signature

```java
public class CreativeCrafting extends java.lang.Object implements ICrafting
```

## Constructors

- `public CreativeCrafting( Minecraft mc)`

## Methods

- `public void updateCraftingInventory( Container containerToSend, java.util.List< ItemStack > itemsList)`
- `public void sendSlotContents( Container containerToSend, int slotInd, ItemStack stack)`
- `public void sendProgressBarUpdate( Container containerIn, int varToUpdate, int newValue)`
- `public void sendAllWindowProperties( Container p_175173_1_, IInventory p_175173_2_)`

## Description

Sends two ints to the client-side Container.
