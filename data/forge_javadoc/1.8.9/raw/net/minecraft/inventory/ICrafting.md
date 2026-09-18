---
title: "ICrafting"
description: "Sends two ints to the client-side Container."
package: "net/minecraft/inventory"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/inventory/ICrafting.html"
sourceType: javadoc
---

# ICrafting

## Class signature

```java
public interface ICrafting
```

## Methods

- `void updateCraftingInventory( Container containerToSend, java.util.List< ItemStack > itemsList)`
- `void sendSlotContents( Container containerToSend, int slotInd, ItemStack stack)`
- `void sendProgressBarUpdate( Container containerIn, int varToUpdate, int newValue)`
- `void sendAllWindowProperties( Container p_175173_1_, IInventory p_175173_2_)`

## Description

Sends two ints to the client-side Container.
