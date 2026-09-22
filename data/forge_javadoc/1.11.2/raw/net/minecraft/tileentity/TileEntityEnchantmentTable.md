---
title: "TileEntityEnchantmentTable"
description: "public class TileEntityEnchantmentTable extends TileEntity implements ITickable, IInteractionObject"
package: "net/minecraft/tileentity"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/tileentity/TileEntityEnchantmentTable.html"
sourceType: javadoc
---

# TileEntityEnchantmentTable

**Inheritance:** java.lang.Object → net.minecraft.tileentity.TileEntity → net.minecraft.tileentity.TileEntityEnchantmentTable

## Class signature

```java
public class TileEntityEnchantmentTable extends TileEntity implements ITickable, IInteractionObject
```

## Constructors

- `TileEntityEnchantmentTable()`

## Methods

- `Container createContainer(InventoryPlayer playerInventory, EntityPlayer playerIn)`
- `ITextComponent getDisplayName()`
- `java.lang.String getGuiID()`
- `java.lang.String getName()`
- `boolean hasCustomName()`
- `void readFromNBT(NBTTagCompound compound)`
- `void setCustomName(java.lang.String customNameIn)`
- `void update()`
- `NBTTagCompound writeToNBT(NBTTagCompound compound)`

## Fields

- `float bookRotation`
- `float bookRotationPrev`
- `float bookSpread`
- `float bookSpreadPrev`
- `float flipA`
- `float flipT`
- `float pageFlip`
- `float pageFlipPrev`
- `int tickCount`
- `float tRot`
