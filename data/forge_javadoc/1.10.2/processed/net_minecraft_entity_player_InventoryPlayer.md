# InventoryPlayer

## Class signature

```java
public class InventoryPlayer extends java.lang.Object implements IInventory
```

## Constructors

- `public InventoryPlayer( EntityPlayer playerIn)`

## Methods

- `@Nullable public ItemStack getCurrentItem()`
- `public static int getHotbarSize()`
- `public int getFirstEmptyStack()`
- `public void setPickedItemStack( ItemStack stack)`
- `public void pickItem(int index)`
- `public static boolean isHotbar(int index)`
- `public int getSlotFor( ItemStack stack)`
- `public int getBestHotbarSlot()`
- `public void changeCurrentItem(int direction)`
- `public int clearMatchingItems(@Nullable Item itemIn, int metadataIn, int removeCount, @Nullable NBTTagCompound itemNBT)`
- `public void decrementAnimations()`
- `public boolean addItemStackToInventory(@Nullable ItemStack itemStackIn)`
- `@Nullable public ItemStack decrStackSize(int index, int count)`
- `public void deleteStack( ItemStack stack)`
- `@Nullable public ItemStack removeStackFromSlot(int index)`
- `public void setInventorySlotContents(int index, @Nullable ItemStack stack)`
- `public float getStrVsBlock( IBlockState state)`
- `public NBTTagList writeToNBT( NBTTagList nbtTagListIn)`
- `public void readFromNBT( NBTTagList nbtTagListIn)`
- `public int getSizeInventory()`
- `@Nullable public ItemStack getStackInSlot(int index)`
- `public java.lang.String getName()`
- `public boolean hasCustomName()`
- `public ITextComponent getDisplayName()`
- `public int getInventoryStackLimit()`
- `public boolean canHarvestBlock( IBlockState state)`
- `public ItemStack armorItemInSlot(int slotIn)`
- `public void damageArmor(float damage)`
- `public void dropAllItems()`
- `public void markDirty()`
- `public void setItemStack(@Nullable ItemStack itemStackIn)`
- `@Nullable public ItemStack getItemStack()`
- `public boolean isUseableByPlayer( EntityPlayer player)`
- `public boolean hasItemStack( ItemStack itemStackIn)`
- `public void openInventory( EntityPlayer player)`
- `public void closeInventory( EntityPlayer player)`
- `public boolean isItemValidForSlot(int index, ItemStack stack)`
- `public void copyInventory( InventoryPlayer playerInventory)`
- `public int getField(int id)`
- `public void setField(int id, int value)`
- `public int getFieldCount()`
- `public void clear()`