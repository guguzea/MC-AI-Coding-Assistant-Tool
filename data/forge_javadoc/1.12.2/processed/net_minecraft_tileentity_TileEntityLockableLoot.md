# TileEntityLockableLoot

**Inheritance:** java.lang.Object → net.minecraft.tileentity.TileEntity → net.minecraft.tileentity.TileEntityLockable → net.minecraft.tileentity.TileEntityLockableLoot

## Class signature

```java
public abstract class TileEntityLockableLoot extends TileEntityLockable implements ILootContainer
```

## Constructors

- `TileEntityLockableLoot()`

## Methods

- `protected boolean checkLootAndRead(NBTTagCompound compound)`
- `protected boolean checkLootAndWrite(NBTTagCompound compound)`
- `void clear()`
- `void closeInventory(EntityPlayer player)`
- `ItemStack decrStackSize(int index, int count)`
- `void fillWithLoot(EntityPlayer player)`
- `int getField(int id)`
- `int getFieldCount()`
- `protected abstract NonNullList<ItemStack> getItems()`
- `ResourceLocation getLootTable()`
- `ItemStack getStackInSlot(int index)`
- `boolean hasCustomName()`
- `boolean isItemValidForSlot(int index, ItemStack stack)`
- `boolean isUsableByPlayer(EntityPlayer player)`
- `void openInventory(EntityPlayer player)`
- `ItemStack removeStackFromSlot(int index)`
- `void setCustomName(java.lang.String p_190575_1_)`
- `void setField(int id, int value)`
- `void setInventorySlotContents(int index, ItemStack stack)`
- `void setLootTable(ResourceLocation p_189404_1_, long p_189404_2_)`

## Fields

- `protected java.lang.String customName`
- `protected ResourceLocation lootTable`
- `protected long lootTableSeed`