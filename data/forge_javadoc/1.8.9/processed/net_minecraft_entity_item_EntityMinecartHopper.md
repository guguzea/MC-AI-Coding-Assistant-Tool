# EntityMinecartHopper

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.item.EntityMinecart → net.minecraft.entity.item.EntityMinecartContainer → net.minecraft.entity.item.EntityMinecartHopper

## Class signature

```java
public class EntityMinecartHopper extends EntityMinecartContainer implements IHopper
```

## Methods

- `boolean canTransfer()` — Returns whether the hopper cart can currently transfer an item.
- `Container createContainer(InventoryPlayer playerInventory, EntityPlayer playerIn)`
- `boolean func_96112_aD()`
- `boolean getBlocked()` — Get whether this hopper minecart is being blocked by an activator rail.
- `IBlockState getDefaultDisplayTile()`
- `int getDefaultDisplayTileOffset()`
- `java.lang.String getGuiID()`
- `EntityMinecart.EnumMinecartType getMinecartType()`
- `int getSizeInventory()` — Returns the number of slots in the inventory.
- `World getWorld()` — Returns the worldObj for this tileEntity.
- `double getXPos()` — Gets the world X position for this hopper entity.
- `double getYPos()` — Gets the world Y position for this hopper entity.
- `double getZPos()` — Gets the world Z position for this hopper entity.
- `boolean interactFirst(EntityPlayer playerIn)` — First layer of player interaction
- `void killMinecart(DamageSource p_94095_1_)`
- `void onActivatorRailPass(int x, int y, int z, boolean receivingPower)` — Called every tick the minecart is on an activator rail.
- `void onUpdate()` — Called to update the entity's position/logic.
- `protected void readEntityFromNBT(NBTTagCompound tagCompund)` — (abstract) Protected helper method to read subclass entity data from NBT.
- `void setBlocked(boolean p_96110_1_)` — Set whether this hopper minecart is being blocked by an activator rail.
- `void setTransferTicker(int p_98042_1_)` — Sets the transfer ticker, used to determine the delay between transfers.
- `protected void writeEntityToNBT(NBTTagCompound tagCompound)` — (abstract) Protected helper method to write subclass entity data to NBT.

## Fields

- `EntityMinecartHopper`
- `EntityMinecartHopper`