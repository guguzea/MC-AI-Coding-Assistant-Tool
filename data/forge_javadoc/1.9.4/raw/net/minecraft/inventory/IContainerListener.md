---
title: "IContainerListener"
description: "public interface IContainerListener"
package: "net/minecraft/inventory"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/inventory/IContainerListener.html"
sourceType: javadoc
---

# IContainerListener

## Class signature

```java
public interface IContainerListener
```

## Methods

- `void updateCraftingInventory( Container containerToSend, java.util.List< ItemStack > itemsList)`
- `void sendSlotContents( Container containerToSend, int slotInd, ItemStack stack)`
- `void sendProgressBarUpdate( Container containerIn, int varToUpdate, int newValue)`
- `void sendAllWindowProperties( Container containerIn, IInventory inventory)`
