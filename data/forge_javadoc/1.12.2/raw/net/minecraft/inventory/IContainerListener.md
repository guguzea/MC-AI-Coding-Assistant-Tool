---
title: "IContainerListener"
description: "public interface IContainerListener"
package: "net/minecraft/inventory"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/inventory/IContainerListener.html"
sourceType: javadoc
---

# IContainerListener

## Class signature

```java
public interface IContainerListener
```

## Methods

- `void sendAllContents(Container containerToSend, NonNullList<ItemStack> itemsList)`
- `void sendAllWindowProperties(Container containerIn, IInventory inventory)`
- `void sendSlotContents(Container containerToSend, int slotInd, ItemStack stack)`
- `void sendWindowProperty(Container containerIn, int varToUpdate, int newValue)`
