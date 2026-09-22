# TileEntityChest

**Inheritance:** java.lang.Object → net.minecraft.tileentity.TileEntity → net.minecraft.tileentity.TileEntityLockable → net.minecraft.tileentity.TileEntityLockableLoot → net.minecraft.tileentity.TileEntityChest

## Class signature

```java
public class TileEntityChest extends TileEntityLockableLoot implements ITickable, IInventory
```

## Constructors

- `TileEntityChest()`
- `TileEntityChest(BlockChest.Type typeIn)`

## Methods

- `void checkForAdjacentChests()`
- `void clear()`
- `void closeInventory(EntityPlayer player)`
- `Container createContainer(InventoryPlayer playerInventory, EntityPlayer playerIn)`
- `ItemStack decrStackSize(int index, int count)`
- `protected TileEntityChest getAdjacentChest(EnumFacing side)`
- `<T> T getCapability(Capability<T> capability, EnumFacing facing)` — Retrieves the handler for the capability requested on the specific side.
- `BlockChest.Type getChestType()`
- `int getField(int id)`
- `int getFieldCount()`
- `java.lang.String getGuiID()`
- `int getInventoryStackLimit()`
- `java.lang.String getName()`
- `IItemHandler getSingleChestHandler()`
- `int getSizeInventory()`
- `ItemStack getStackInSlot(int index)`
- `boolean hasCustomName()`
- `void invalidate()`
- `boolean isItemValidForSlot(int index, ItemStack stack)`
- `boolean isUseableByPlayer(EntityPlayer player)`
- `void openInventory(EntityPlayer player)`
- `void readFromNBT(NBTTagCompound compound)`
- `boolean receiveClientEvent(int id, int type)`
- `static void registerFixesChest(DataFixer fixer)`
- `ItemStack removeStackFromSlot(int index)`
- `void setCustomName(java.lang.String name)`
- `void setField(int id, int value)`
- `void setInventorySlotContents(int index, ItemStack stack)`
- `void update()`
- `void updateContainingBlockInfo()`
- `NBTTagCompound writeToNBT(NBTTagCompound compound)`

## Fields

- `boolean adjacentChestChecked`
- `TileEntityChest adjacentChestXNeg`
- `TileEntityChest adjacentChestXPos`
- `TileEntityChest adjacentChestZNeg`
- `TileEntityChest adjacentChestZPos`
- `VanillaDoubleChestItemHandler doubleChestHandler`
- `float lidAngle`
- `int numPlayersUsing`
- `float prevLidAngle`