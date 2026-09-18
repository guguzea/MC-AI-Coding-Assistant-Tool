# EntityMinecartContainer

## Class signature

```java
public abstract class EntityMinecartContainer extends EntityMinecart implements ILockableContainer
```

## Constructors

- `public EntityMinecartContainer( World worldIn)`
- `public EntityMinecartContainer( World worldIn, double p_i1717_2_, double p_i1717_4_, double p_i1717_6_)`

## Methods

- `public void killMinecart( DamageSource p_94095_1_)`
- `public ItemStack getStackInSlot(int index)`
- `public ItemStack decrStackSize(int index, int count)`
- `public ItemStack removeStackFromSlot(int index)`
- `public void setInventorySlotContents(int index, ItemStack stack)`
- `public void markDirty()`
- `public boolean isUseableByPlayer( EntityPlayer player)`
- `public void openInventory( EntityPlayer player)`
- `public void closeInventory( EntityPlayer player)`
- `public boolean isItemValidForSlot(int index, ItemStack stack)`
- `public java.lang.String getName()`
- `public int getInventoryStackLimit()`
- `public void travelToDimension(int dimensionId)`
- `public void setDead()`
- `protected void writeEntityToNBT( NBTTagCompound tagCompound)`
- `protected void readEntityFromNBT( NBTTagCompound tagCompund)`
- `public boolean interactFirst( EntityPlayer playerIn)`
- `protected void applyDrag()`
- `public int getField(int id)`
- `public void setField(int id, int value)`
- `public int getFieldCount()`
- `public boolean isLocked()`
- `public void setLockCode( LockCode code)`
- `public LockCode getLockCode()`
- `public void clear()`
- `public <T> T getCapability( Capability <T> capability, EnumFacing facing)`
- `public boolean hasCapability( Capability <?> capability, EnumFacing facing)`

## Description

When set to true, the minecart will drop all items when setDead() is called.