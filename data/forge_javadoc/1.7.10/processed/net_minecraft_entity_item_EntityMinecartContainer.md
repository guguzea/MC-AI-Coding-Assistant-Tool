# EntityMinecartContainer

## Class signature

```java
public abstract class EntityMinecartContainer extends EntityMinecart implements IInventory
```

## Constructors

- `public EntityMinecartContainer( World p_i1716_1_)`
- `public EntityMinecartContainer( World p_i1717_1_, double p_i1717_2_, double p_i1717_4_, double p_i1717_6_)`

## Methods

- `public void killMinecart( DamageSource p_94095_1_)`
- `public ItemStack getStackInSlot(int p_70301_1_)`
- `public ItemStack decrStackSize(int p_70298_1_, int p_70298_2_)`
- `public ItemStack getStackInSlotOnClosing(int p_70304_1_)`
- `public void setInventorySlotContents(int p_70299_1_, ItemStack p_70299_2_)`
- `public void markDirty()`
- `public boolean isUseableByPlayer( EntityPlayer p_70300_1_)`
- `public void openInventory()`
- `public void closeInventory()`
- `public boolean isItemValidForSlot(int p_94041_1_, ItemStack p_94041_2_)`
- `public java.lang.String getInventoryName()`
- `public int getInventoryStackLimit()`
- `public void travelToDimension(int p_71027_1_)`
- `public void setDead()`
- `protected void writeEntityToNBT( NBTTagCompound p_70014_1_)`
- `protected void readEntityFromNBT( NBTTagCompound p_70037_1_)`
- `public boolean interactFirst( EntityPlayer p_130002_1_)`
- `protected void applyDrag()`