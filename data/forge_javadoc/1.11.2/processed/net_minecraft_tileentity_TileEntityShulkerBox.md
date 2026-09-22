# TileEntityShulkerBox

**Inheritance:** java.lang.Object → net.minecraft.tileentity.TileEntity → net.minecraft.tileentity.TileEntityLockable → net.minecraft.tileentity.TileEntityLockableLoot → net.minecraft.tileentity.TileEntityShulkerBox

## Class signature

```java
public class TileEntityShulkerBox extends TileEntityLockableLoot implements ITickable, ISidedInventory
```

## Methods

- `boolean canExtractItem(int index, ItemStack stack, EnumFacing direction)`
- `boolean canInsertItem(int index, ItemStack itemStackIn, EnumFacing direction)`
- `void clear()`
- `void closeInventory(EntityPlayer player)`
- `Container createContainer(InventoryPlayer playerInventory, EntityPlayer playerIn)`
- `TileEntityShulkerBox.AnimationStatus getAnimationStatus()`
- `AxisAlignedBB getBoundingBox(EnumFacing p_190587_1_)`
- `AxisAlignedBB getBoundingBox(IBlockState p_190584_1_)`
- `EnumDyeColor getColor()`
- `java.lang.String getGuiID()`
- `int getInventoryStackLimit()`
- `protected NonNullList<ItemStack> getItems()`
- `java.lang.String getName()`
- `float getProgress(float p_190585_1_)`
- `int getSizeInventory()`
- `int[] getSlotsForFace(EnumFacing side)`
- `SPacketUpdateTileEntity getUpdatePacket()`
- `boolean isCleared()`
- `boolean isDestroyedByCreativePlayer()`
- `boolean isEmpty()`
- `void loadFromNbt(NBTTagCompound compound)`
- `void openInventory(EntityPlayer player)`
- `void readFromNBT(NBTTagCompound compound)`
- `boolean receiveClientEvent(int id, int type)`
- `static void registerFixesShulkerBox(DataFixer p_190593_0_)`
- `NBTTagCompound saveToNbt(NBTTagCompound compound)`
- `void setDestroyedByCreativePlayer(boolean p_190579_1_)`
- `boolean shouldDrop()`
- `void update()`
- `protected void updateAnimation()`
- `NBTTagCompound writeToNBT(NBTTagCompound compound)`

## Fields

- `TileEntityShulkerBox`
- `TileEntityShulkerBox`