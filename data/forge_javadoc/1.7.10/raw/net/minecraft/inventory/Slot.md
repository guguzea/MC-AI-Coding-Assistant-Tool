---
title: "Slot"
description: "public class Slot extends java.lang.Object"
package: "net/minecraft/inventory"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/net/minecraft/inventory/Slot.html"
sourceType: javadoc
---

# Slot

**Inheritance:** java.lang.Object → net.minecraft.inventory.Slot

## Class signature

```java
public class Slot extends java.lang.Object
```

## Constructors

- `Slot(IInventory p_i1824_1_, int p_i1824_2_, int p_i1824_3_, int p_i1824_4_)`

## Methods

- `boolean canTakeStack(EntityPlayer p_82869_1_)`
- `ItemStack decrStackSize(int p_75209_1_)`
- `boolean func_111238_b()`
- `IIcon getBackgroundIconIndex()`
- `boolean getHasStack()`
- `int getSlotStackLimit()`
- `ItemStack getStack()`
- `boolean isItemValid(ItemStack p_75214_1_)`
- `boolean isSlotInInventory(IInventory p_75217_1_, int p_75217_2_)`
- `protected void onCrafting(ItemStack p_75208_1_)`
- `protected void onCrafting(ItemStack p_75210_1_, int p_75210_2_)`
- `void onPickupFromSlot(EntityPlayer p_82870_1_, ItemStack p_82870_2_)`
- `void onSlotChange(ItemStack p_75220_1_, ItemStack p_75220_2_)`
- `void onSlotChanged()`
- `void putStack(ItemStack p_75215_1_)`

## Fields

- `IInventory inventory`
- `int slotNumber`
- `int xDisplayPosition`
- `int yDisplayPosition`
