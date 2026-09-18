# TileEntityChest

## Class signature

```java
public class TileEntityChest extends TileEntityLockableLoot implements ITickable , IInventory
```

## Constructors

- `public TileEntityChest()`
- `public TileEntityChest( BlockChest.Type typeIn)`

## Methods

- `public int getSizeInventory()`
- `@Nullable public ItemStack getStackInSlot(int index)`
- `@Nullable public ItemStack decrStackSize(int index, int count)`
- `@Nullable public ItemStack removeStackFromSlot(int index)`
- `public void setInventorySlotContents(int index, @Nullable ItemStack stack)`
- `public java.lang.String getName()`
- `public boolean hasCustomName()`
- `public void setCustomName(java.lang.String name)`
- `public void readFromNBT( NBTTagCompound compound)`
- `public NBTTagCompound writeToNBT( NBTTagCompound compound)`
- `public int getInventoryStackLimit()`
- `public boolean isUseableByPlayer( EntityPlayer player)`
- `public void updateContainingBlockInfo()`
- `public void checkForAdjacentChests()`
- `@Nullable protected TileEntityChest getAdjacentChest( EnumFacing side)`
- `public void update()`
- `public boolean receiveClientEvent(int id, int type)`
- `public void openInventory( EntityPlayer player)`
- `public void closeInventory( EntityPlayer player)`
- `public boolean isItemValidForSlot(int index, ItemStack stack)`
- `public void invalidate()`
- `public BlockChest.Type getChestType()`
- `public java.lang.String getGuiID()`
- `public Container createContainer( InventoryPlayer playerInventory, EntityPlayer playerIn)`
- `public int getField(int id)`
- `public void setField(int id, int value)`
- `public int getFieldCount()`
- `public void clear()`
- `public <T> T getCapability( Capability <T> capability, EnumFacing facing)`
- `public IItemHandler getSingleChestHandler()`

## Description

Retrieves the handler for the capability requested on the specific side.