# EntityMinecartHopper

## Class signature

```java
public class EntityMinecartHopper extends EntityMinecartContainer implements IHopper
```

## Constructors

- `public EntityMinecartHopper( World worldIn)`
- `public EntityMinecartHopper( World worldIn, double x, double y, double z)`

## Methods

- `public EntityMinecart.Type getType()`
- `public IBlockState getDefaultDisplayTile()`
- `public int getDefaultDisplayTileOffset()`
- `public int getSizeInventory()`
- `public boolean processInitialInteract( EntityPlayer player, @Nullable ItemStack stack, EnumHand hand)`
- `public void onActivatorRailPass(int x, int y, int z, boolean receivingPower)`
- `public boolean getBlocked()`
- `public void setBlocked(boolean p_96110_1_)`
- `public World getWorld()`
- `public double getXPos()`
- `public double getYPos()`
- `public double getZPos()`
- `public void onUpdate()`
- `public boolean captureDroppedItems()`
- `public void killMinecart( DamageSource source)`
- `protected void writeEntityToNBT( NBTTagCompound compound)`
- `protected void readEntityFromNBT( NBTTagCompound compound)`
- `public void setTransferTicker(int p_98042_1_)`
- `public boolean canTransfer()`
- `public java.lang.String getGuiID()`
- `public Container createContainer( InventoryPlayer playerInventory, EntityPlayer playerIn)`