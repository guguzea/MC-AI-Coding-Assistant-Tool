# InventoryPlayer

**Inheritance:** java.lang.Object → net.minecraft.entity.player.InventoryPlayer

## Class signature

```java
public class InventoryPlayer extends java.lang.Object implements IInventory
```

## Constructors

- `InventoryPlayer(EntityPlayer p_i1750_1_)`

## Methods

- `boolean addItemStackToInventory(ItemStack p_70441_1_)`
- `ItemStack armorItemInSlot(int p_70440_1_)`
- `void changeCurrentItem(int p_70453_1_)`
- `int clearInventory(Item p_146027_1_, int p_146027_2_)`
- `void closeInventory()`
- `boolean consumeInventoryItem(Item p_146026_1_)`
- `void copyInventory(InventoryPlayer p_70455_1_)`
- `void damageArmor(float p_70449_1_)`
- `void decrementAnimations()`
- `ItemStack decrStackSize(int p_70298_1_, int p_70298_2_)`
- `void dropAllItems()`
- `float func_146023_a(Block p_146023_1_)`
- `boolean func_146025_b(Block p_146025_1_)`
- `void func_146030_a(Item p_146030_1_, int p_146030_2_, boolean p_146030_3_, boolean p_146030_4_)`
- `void func_70439_a(Item p_70439_1_, int p_70439_2_)`
- `ItemStack getCurrentItem()`
- `int getFirstEmptyStack()`
- `static int getHotbarSize()`
- `java.lang.String getInventoryName()`
- `int getInventoryStackLimit()`
- `ItemStack getItemStack()`
- `int getSizeInventory()`
- `ItemStack getStackInSlot(int p_70301_1_)`
- `ItemStack getStackInSlotOnClosing(int p_70304_1_)`
- `int getTotalArmorValue()`
- `boolean hasCustomInventoryName()`
- `boolean hasItem(Item p_146028_1_)`
- `boolean hasItemStack(ItemStack p_70431_1_)`
- `boolean isItemValidForSlot(int p_94041_1_, ItemStack p_94041_2_)`
- `boolean isUseableByPlayer(EntityPlayer p_70300_1_)`
- `void markDirty()`
- `void openInventory()`
- `void readFromNBT(NBTTagList p_70443_1_)`
- `void setInventorySlotContents(int p_70299_1_, ItemStack p_70299_2_)`
- `void setItemStack(ItemStack p_70437_1_)`
- `NBTTagList writeToNBT(NBTTagList p_70442_1_)`

## Fields

- `ItemStack [] armorInventory`
- `int currentItem`
- `boolean inventoryChanged`
- `ItemStack [] mainInventory`
- `EntityPlayer player`