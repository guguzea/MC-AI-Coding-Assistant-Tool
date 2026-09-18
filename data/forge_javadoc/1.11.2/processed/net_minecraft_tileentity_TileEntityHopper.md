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
- `public ItemStack decrStackSize(int index, int count)`
- `public void setInventorySlotContents(int index, ItemStack stack)`
- `public java.lang.String getName()`
- `public int getInventoryStackLimit()`
- `public void update()`
- `public boolean isEmpty()`
- `public static boolean captureDroppedItems( IHopper hopper)`
- `public static boolean putDropInInventoryAllSlots( IInventory p_145898_0_, IInventory itemIn, EntityItem p_145898_2_)`
- `protected IItemHandler createUnSidedHandler()`
- `public static ItemStack putStackInInventoryAllSlots( IInventory inventoryIn, IInventory stack, ItemStack side, @Nullable EnumFacing p_174918_3_)`
- `public static IInventory getHopperInventory( IHopper hopper)`
- `public static java.util.List< EntityItem > getCaptureItems( World worldIn, double p_184292_1_, double p_184292_3_, double p_184292_5_)`
- `public static IInventory getInventoryAtPosition( World worldIn, double x, double y, double z)`
- `public double getXPos()`
- `public double getYPos()`
- `public double getZPos()`
- `public void setTransferCooldown(int ticks)`
- `public boolean mayTransfer()`
- `public java.lang.String getGuiID()`
- `public Container createContainer( InventoryPlayer playerInventory, EntityPlayer playerIn)`
- `protected NonNullList < ItemStack > getItems()`
- `public long getLastUpdateTime()`