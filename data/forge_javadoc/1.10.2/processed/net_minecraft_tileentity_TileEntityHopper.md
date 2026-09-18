# TileEntityHopper

## Class signature

```java
public class TileEntityHopper extends TileEntityLockableLoot implements IHopper , ITickable
```

## Constructors

- `public TileEntityHopper()`

## Methods

- `public static void registerFixesHopper( DataFixer fixer)`
- `public void readFromNBT( NBTTagCompound compound)`
- `public NBTTagCompound writeToNBT( NBTTagCompound compound)`
- `public int getSizeInventory()`
- `@Nullable public ItemStack getStackInSlot(int index)`
- `@Nullable public ItemStack decrStackSize(int index, int count)`
- `@Nullable public ItemStack removeStackFromSlot(int index)`
- `public void setInventorySlotContents(int index, @Nullable ItemStack stack)`
- `public java.lang.String getName()`
- `public boolean hasCustomName()`
- `public void setCustomName(java.lang.String customNameIn)`
- `public int getInventoryStackLimit()`
- `public boolean isUseableByPlayer( EntityPlayer player)`
- `public void openInventory( EntityPlayer player)`
- `public void closeInventory( EntityPlayer player)`
- `public boolean isItemValidForSlot(int index, ItemStack stack)`
- `public void update()`
- `public boolean updateHopper()`
- `public static boolean captureDroppedItems( IHopper hopper)`
- `public static boolean putDropInInventoryAllSlots( IInventory p_145898_0_, EntityItem itemIn)`
- `public static ItemStack putStackInInventoryAllSlots( IInventory inventoryIn, ItemStack stack, @Nullable EnumFacing side)`
- `public static IInventory getHopperInventory( IHopper hopper)`
- `public static java.util.List< EntityItem > getCaptureItems( World worldIn, double p_184292_1_, double p_184292_3_, double p_184292_5_)`
- `public static IInventory getInventoryAtPosition( World worldIn, double x, double y, double z)`
- `public double getXPos()`
- `public double getYPos()`
- `public double getZPos()`
- `public void setTransferCooldown(int ticks)`
- `public boolean isOnTransferCooldown()`
- `public boolean mayTransfer()`
- `public java.lang.String getGuiID()`
- `public Container createContainer( InventoryPlayer playerInventory, EntityPlayer playerIn)`
- `public int getField(int id)`
- `public void setField(int id, int value)`
- `public int getFieldCount()`
- `public void clear()`
- `protected IItemHandler createUnSidedHandler()`