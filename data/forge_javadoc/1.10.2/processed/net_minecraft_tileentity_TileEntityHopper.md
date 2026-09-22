# TileEntityHopper

**Inheritance:** java.lang.Object → net.minecraft.tileentity.TileEntity → net.minecraft.tileentity.TileEntityLockable → net.minecraft.tileentity.TileEntityLockableLoot → net.minecraft.tileentity.TileEntityHopper

## Class signature

```java
public class TileEntityHopper extends TileEntityLockableLoot implements IHopper, ITickable
```

## Methods

- `static boolean captureDroppedItems(IHopper hopper)`
- `void clear()`
- `void closeInventory(EntityPlayer player)`
- `Container createContainer(InventoryPlayer playerInventory, EntityPlayer playerIn)`
- `protected IItemHandler createUnSidedHandler()`
- `ItemStack decrStackSize(int index, int count)`
- `static java.util.List<EntityItem> getCaptureItems(World worldIn, double p_184292_1_, double p_184292_3_, double p_184292_5_)`
- `int getField(int id)`
- `int getFieldCount()`
- `java.lang.String getGuiID()`
- `static IInventory getHopperInventory(IHopper hopper)`
- `static IInventory getInventoryAtPosition(World worldIn, double x, double y, double z)`
- `int getInventoryStackLimit()`
- `java.lang.String getName()`
- `int getSizeInventory()`
- `ItemStack getStackInSlot(int index)`
- `double getXPos()`
- `double getYPos()`
- `double getZPos()`
- `boolean hasCustomName()`
- `boolean isItemValidForSlot(int index, ItemStack stack)`
- `boolean isOnTransferCooldown()`
- `boolean isUseableByPlayer(EntityPlayer player)`
- `boolean mayTransfer()`
- `void openInventory(EntityPlayer player)`
- `static boolean putDropInInventoryAllSlots(IInventory p_145898_0_, EntityItem itemIn)`
- `static ItemStack putStackInInventoryAllSlots(IInventory inventoryIn, ItemStack stack, EnumFacing side)`
- `void readFromNBT(NBTTagCompound compound)`
- `static void registerFixesHopper(DataFixer fixer)`
- `ItemStack removeStackFromSlot(int index)`
- `void setCustomName(java.lang.String customNameIn)`
- `void setField(int id, int value)`
- `void setInventorySlotContents(int index, ItemStack stack)`
- `void setTransferCooldown(int ticks)`
- `void update()`
- `boolean updateHopper()`
- `NBTTagCompound writeToNBT(NBTTagCompound compound)`

## Fields

- `TileEntityHopper`