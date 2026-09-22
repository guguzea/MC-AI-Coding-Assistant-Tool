---
title: "InventoryEnderChest"
description: "public class InventoryEnderChest extends InventoryBasic"
package: "net/minecraft/inventory"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/inventory/InventoryEnderChest.html"
sourceType: javadoc
---

# InventoryEnderChest

**Inheritance:** java.lang.Object → net.minecraft.inventory.InventoryBasic → net.minecraft.inventory.InventoryEnderChest

## Class signature

```java
public class InventoryEnderChest extends InventoryBasic
```

## Constructors

- `InventoryEnderChest()`

## Methods

- `void closeInventory(EntityPlayer player)`
- `boolean isUseableByPlayer(EntityPlayer player)` — Do not make give this method the name canInteractWith because it clashes with Container
- `void loadInventoryFromNBT(NBTTagList p_70486_1_)`
- `void openInventory(EntityPlayer player)`
- `NBTTagList saveInventoryToNBT()`
- `void setChestTileEntity(TileEntityEnderChest chestTileEntity)`
