# EntityMinecartHopper

## Class signature

```java
public class EntityMinecartHopper extends EntityMinecartContainer implements IHopper
```

## Constructors

- `public EntityMinecartHopper( World worldIn)`
- `public EntityMinecartHopper( World worldIn, double p_i1721_2_, double p_i1721_4_, double p_i1721_6_)`

## Methods

- `public EntityMinecart.EnumMinecartType getMinecartType()`
- `public IBlockState getDefaultDisplayTile()`
- `public int getDefaultDisplayTileOffset()`
- `public int getSizeInventory()`
- `public boolean interactFirst( EntityPlayer playerIn)`
- `public void onActivatorRailPass(int x, int y, int z, boolean receivingPower)`
- `public boolean getBlocked()`
- `public void setBlocked(boolean p_96110_1_)`
- `public World getWorld()`
- `public double getXPos()`
- `public double getYPos()`
- `public double getZPos()`
- `public void onUpdate()`
- `public boolean func_96112_aD()`
- `public void killMinecart( DamageSource p_94095_1_)`
- `protected void writeEntityToNBT( NBTTagCompound tagCompound)`
- `protected void readEntityFromNBT( NBTTagCompound tagCompund)`
- `public void setTransferTicker(int p_98042_1_)`
- `public boolean canTransfer()`
- `public java.lang.String getGuiID()`
- `public Container createContainer( InventoryPlayer playerInventory, EntityPlayer playerIn)`

## Description

Returns whether the hopper cart can currently transfer an item.