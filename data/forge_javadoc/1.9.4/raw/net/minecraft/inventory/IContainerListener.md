---
title: "IContainerListener"
description: "public interface IContainerListener"
package: "net/minecraft/inventory"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/inventory/IContainerListener.html"
sourceType: javadoc
---

# IContainerListener

## Class signature

```java
public interface IContainerListener
```

## Methods

- `void sendAllWindowProperties(Container containerIn, IInventory inventory)`
- `void sendProgressBarUpdate(Container containerIn, int varToUpdate, int newValue)`
- `void sendSlotContents(Container containerToSend, int slotInd, ItemStack stack)`
- `void updateCraftingInventory(Container containerToSend, java.util.List<ItemStack> itemsList)`
