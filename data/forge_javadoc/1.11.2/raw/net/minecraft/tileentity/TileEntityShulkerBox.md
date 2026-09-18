---
title: "TileEntityShulkerBox"
description: "public class TileEntityShulkerBox extends TileEntityLockableLoot implements ITickable , ISidedInventory"
package: "net/minecraft/tileentity"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/tileentity/TileEntityShulkerBox.html"
sourceType: javadoc
---

# TileEntityShulkerBox

## Class signature

```java
public class TileEntityShulkerBox extends TileEntityLockableLoot implements ITickable , ISidedInventory
```

## Constructors

- `public TileEntityShulkerBox()`
- `public TileEntityShulkerBox(@Nullable EnumDyeColor colorIn)`

## Methods

- `public void update()`
- `protected void updateAnimation()`
- `public TileEntityShulkerBox.AnimationStatus getAnimationStatus()`
- `public AxisAlignedBB getBoundingBox( IBlockState p_190584_1_)`
- `public AxisAlignedBB getBoundingBox( EnumFacing p_190587_1_)`
- `public int getSizeInventory()`
- `public int getInventoryStackLimit()`
- `public boolean receiveClientEvent(int id, int type)`
- `public void openInventory( EntityPlayer player)`
- `public void closeInventory( EntityPlayer player)`
- `public Container createContainer( InventoryPlayer playerInventory, EntityPlayer playerIn)`
- `public java.lang.String getGuiID()`
- `public java.lang.String getName()`
- `public static void registerFixesShulkerBox( DataFixer p_190593_0_)`
- `public void readFromNBT( NBTTagCompound compound)`
- `public NBTTagCompound writeToNBT( NBTTagCompound compound)`
- `public void loadFromNbt( NBTTagCompound compound)`
- `public NBTTagCompound saveToNbt( NBTTagCompound compound)`
- `protected NonNullList < ItemStack > getItems()`
- `public boolean isEmpty()`
- `public int[] getSlotsForFace( EnumFacing side)`
- `public boolean canInsertItem(int index, ItemStack itemStackIn, EnumFacing direction)`
- `public boolean canExtractItem(int index, ItemStack stack, EnumFacing direction)`
- `public void clear()`
- `public boolean isCleared()`
- `public float getProgress(float p_190585_1_)`
- `public EnumDyeColor getColor()`
- `@Nullable public SPacketUpdateTileEntity getUpdatePacket()`
- `public boolean isDestroyedByCreativePlayer()`
- `public void setDestroyedByCreativePlayer(boolean p_190579_1_)`
- `public boolean shouldDrop()`
