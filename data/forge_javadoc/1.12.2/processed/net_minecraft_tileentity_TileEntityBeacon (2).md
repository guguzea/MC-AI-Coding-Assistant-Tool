# TileEntityBeacon

## Class signature

```java
public class TileEntityBeacon extends TileEntityLockable implements ITickable , ISidedInventory
```

## Constructors

- `public TileEntityBeacon()`

## Methods

- `public void update()`
- `public void updateBeacon()`
- `public java.util.List< TileEntityBeacon.BeamSegment > getBeamSegments()`
- `public float shouldBeamRender()`
- `public int getLevels()`
- `public SPacketUpdateTileEntity getUpdatePacket()`
- `public NBTTagCompound getUpdateTag()`
- `public double getMaxRenderDistanceSquared()`
- `public void readFromNBT( NBTTagCompound compound)`
- `public NBTTagCompound writeToNBT( NBTTagCompound compound)`
- `public int getSizeInventory()`
- `public boolean isEmpty()`
- `public ItemStack getStackInSlot(int index)`
- `public ItemStack decrStackSize(int index, int count)`
- `public ItemStack removeStackFromSlot(int index)`
- `public void setInventorySlotContents(int index, ItemStack stack)`
- `public java.lang.String getName()`
- `public boolean hasCustomName()`
- `public void setName(java.lang.String name)`
- `public int getInventoryStackLimit()`
- `public boolean isUsableByPlayer( EntityPlayer player)`
- `public void openInventory( EntityPlayer player)`
- `public void closeInventory( EntityPlayer player)`
- `public boolean isItemValidForSlot(int index, ItemStack stack)`
- `public java.lang.String getGuiID()`
- `public Container createContainer( InventoryPlayer playerInventory, EntityPlayer playerIn)`
- `public int getField(int id)`
- `public void setField(int id, int value)`
- `public int getFieldCount()`
- `public void clear()`
- `public boolean receiveClientEvent(int id, int type)`
- `public int[] getSlotsForFace( EnumFacing side)`
- `public boolean canInsertItem(int index, ItemStack itemStackIn, EnumFacing direction)`
- `public boolean canExtractItem(int index, ItemStack stack, EnumFacing direction)`