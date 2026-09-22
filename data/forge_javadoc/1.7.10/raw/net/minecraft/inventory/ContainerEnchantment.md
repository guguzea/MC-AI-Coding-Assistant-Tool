---
title: "ContainerEnchantment"
description: "public class ContainerEnchantment extends Container"
package: "net/minecraft/inventory"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/net/minecraft/inventory/ContainerEnchantment.html"
sourceType: javadoc
---

# ContainerEnchantment

**Inheritance:** java.lang.Object → net.minecraft.inventory.Container → net.minecraft.inventory.ContainerEnchantment

## Class signature

```java
public class ContainerEnchantment extends Container
```

## Constructors

- `ContainerEnchantment(InventoryPlayer p_i1811_1_, World p_i1811_2_, int p_i1811_3_, int p_i1811_4_, int p_i1811_5_)`

## Methods

- `void addCraftingToCrafters(ICrafting p_75132_1_)`
- `boolean canInteractWith(EntityPlayer p_75145_1_)`
- `void detectAndSendChanges()`
- `boolean enchantItem(EntityPlayer p_75140_1_, int p_75140_2_)`
- `void onContainerClosed(EntityPlayer p_75134_1_)`
- `void onCraftMatrixChanged(IInventory p_75130_1_)`
- `ItemStack transferStackInSlot(EntityPlayer p_82846_1_, int p_82846_2_)`
- `void updateProgressBar(int p_75137_1_, int p_75137_2_)`

## Fields

- `int[] enchantLevels`
- `long nameSeed`
- `IInventory tableInventory`
