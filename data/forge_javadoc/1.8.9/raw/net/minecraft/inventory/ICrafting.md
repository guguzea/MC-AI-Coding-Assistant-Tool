---
title: "ICrafting"
description: "public interface ICrafting"
package: "net/minecraft/inventory"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/inventory/ICrafting.html"
sourceType: javadoc
---

# ICrafting

## Class signature

```java
public interface ICrafting
```

## Methods

- `void sendAllWindowProperties(Container p_175173_1_, IInventory p_175173_2_)`
- `void sendProgressBarUpdate(Container containerIn, int varToUpdate, int newValue)` — Sends two ints to the client-side Container.
- `void sendSlotContents(Container containerToSend, int slotInd, ItemStack stack)` — Sends the contents of an inventory slot to the client-side Container.
- `void updateCraftingInventory(Container containerToSend, java.util.List<ItemStack> itemsList)` — update the crafting window inventory with the items in the list
