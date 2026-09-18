---
title: "SlotItemHandler"
description: "public class SlotItemHandler extends Slot"
package: "net/minecraftforge/items"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/items/SlotItemHandler.html"
sourceType: javadoc
---

# SlotItemHandler

## Class signature

```java
public class SlotItemHandler extends Slot
```

## Constructors

- `public SlotItemHandler( IItemHandler itemHandler, int index, int xPosition, int yPosition)`

## Methods

- `public boolean isItemValid( ItemStack stack)`
- `public ItemStack getStack()`
- `public void putStack( ItemStack stack)`
- `public void onSlotChange( ItemStack p_75220_1_, ItemStack p_75220_2_)`
- `public int getItemStackLimit( ItemStack stack)`
- `public boolean canTakeStack( EntityPlayer playerIn)`
- `public ItemStack decrStackSize(int amount)`
- `public IItemHandler getItemHandler()`
