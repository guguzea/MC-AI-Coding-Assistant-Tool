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
- `protected boolean updateHopper()`
- `public boolean isEmpty()`
- `public static boolean pullItems( IHopper hopper)`
- `public static boolean putDropInInventoryAllSlots( IInventory source, IInventory destination, EntityItem entity)`
- `protected IItemHandler createUnSidedHandler()`
- `public static ItemStack putStackInInventoryAllSlots( IInventory source, IInventory destination, ItemStack stack, EnumFacing direction)`
- `public static IInventory getSourceInventory( IHopper hopper)`
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