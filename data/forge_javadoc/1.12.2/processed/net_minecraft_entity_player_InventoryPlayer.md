# InventoryPlayer

**Inheritance:** java.lang.Object → net.minecraft.entity.player.InventoryPlayer

## Class signature

```java
public class InventoryPlayer extends java.lang.Object implements IInventory
```

## Constructors

- `InventoryPlayer(EntityPlayer playerIn)`

## Methods

- `boolean add(int p_191971_1_, ItemStack p_191971_2_)`
- `boolean addItemStackToInventory(ItemStack itemStackIn)`
- `ItemStack armorItemInSlot(int slotIn)`
- `boolean canHarvestBlock(IBlockState state)`
- `void changeCurrentItem(int direction)`
- `void clear()`
- `int clearMatchingItems(Item itemIn, int metadataIn, int removeCount, NBTTagCompound itemNBT)`
- `void closeInventory(EntityPlayer player)`
- `void copyInventory(InventoryPlayer playerInventory)`
- `void damageArmor(float damage)`
- `void decrementAnimations()`
- `ItemStack decrStackSize(int index, int count)`
- `void deleteStack(ItemStack stack)`
- `void dropAllItems()`
- `void fillStackedContents(RecipeItemHelper helper, boolean p_194016_2_)`
- `int findSlotMatchingUnusedItem(ItemStack p_194014_1_)`
- `int getBestHotbarSlot()`
- `ItemStack getCurrentItem()`
- `float getDestroySpeed(IBlockState state)`
- `ITextComponent getDisplayName()`
- `int getField(int id)`
- `int getFieldCount()`
- `int getFirstEmptyStack()`
- `static int getHotbarSize()`
- `int getInventoryStackLimit()`
- `ItemStack getItemStack()`
- `java.lang.String getName()`
- `int getSizeInventory()`
- `int getSlotFor(ItemStack stack)`
- `ItemStack getStackInSlot(int index)`
- `int getTimesChanged()`
- `boolean hasCustomName()`
- `boolean hasItemStack(ItemStack itemStackIn)`
- `boolean isEmpty()`
- `static boolean isHotbar(int index)`
- `boolean isItemValidForSlot(int index, ItemStack stack)`
- `boolean isUsableByPlayer(EntityPlayer player)`
- `void markDirty()`
- `void openInventory(EntityPlayer player)`
- `void pickItem(int index)`
- `void placeItemBackInInventory(World p_191975_1_, ItemStack p_191975_2_)`
- `void readFromNBT(NBTTagList nbtTagListIn)`
- `ItemStack removeStackFromSlot(int index)`
- `void setField(int id, int value)`
- `void setInventorySlotContents(int index, ItemStack stack)`
- `void setItemStack(ItemStack itemStackIn)`
- `void setPickedItemStack(ItemStack stack)`
- `int storeItemStack(ItemStack itemStackIn)`
- `NBTTagList writeToNBT(NBTTagList nbtTagListIn)`

## Fields

- `NonNullList<ItemStack> armorInventory`
- `int currentItem`
- `NonNullList<ItemStack> mainInventory`
- `NonNullList<ItemStack> offHandInventory`
- `EntityPlayer player`