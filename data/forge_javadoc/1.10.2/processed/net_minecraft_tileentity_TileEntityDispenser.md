# TileEntityDispenser

**Inheritance:** java.lang.Object → net.minecraft.tileentity.TileEntity → net.minecraft.tileentity.TileEntityLockable → net.minecraft.tileentity.TileEntityLockableLoot → net.minecraft.tileentity.TileEntityDispenser

## Class signature

```java
public class TileEntityDispenser extends TileEntityLockableLoot implements IInventory
```

## Constructors

- `TileEntityDispenser()`

## Methods

- `int addItemStack(ItemStack stack)`
- `void clear()`
- `void closeInventory(EntityPlayer player)`
- `Container createContainer(InventoryPlayer playerInventory, EntityPlayer playerIn)`
- `ItemStack decrStackSize(int index, int count)`
- `int getDispenseSlot()`
- `int getField(int id)`
- `int getFieldCount()`
- `java.lang.String getGuiID()`
- `int getInventoryStackLimit()`
- `java.lang.String getName()`
- `int getSizeInventory()`
- `ItemStack getStackInSlot(int index)`
- `boolean hasCustomName()`
- `boolean isItemValidForSlot(int index, ItemStack stack)`
- `boolean isUseableByPlayer(EntityPlayer player)`
- `void openInventory(EntityPlayer player)`
- `void readFromNBT(NBTTagCompound compound)`
- `static void registerFixes(DataFixer fixer)`
- `ItemStack removeStackFromSlot(int index)`
- `void setCustomName(java.lang.String customName)`
- `void setField(int id, int value)`
- `void setInventorySlotContents(int index, ItemStack stack)`
- `NBTTagCompound writeToNBT(NBTTagCompound compound)`

## Fields

- `protected java.lang.String customName`