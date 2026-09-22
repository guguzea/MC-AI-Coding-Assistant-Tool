# EntityMinecartCommandBlock

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.item.EntityMinecart → net.minecraft.entity.EntityMinecartCommandBlock

## Class signature

```java
public class EntityMinecartCommandBlock extends EntityMinecart
```

## Methods

- `protected void entityInit()`
- `CommandBlockLogic getCommandBlockLogic()`
- `IBlockState getDefaultDisplayTile()`
- `EntityMinecart.EnumMinecartType getMinecartType()`
- `boolean interactFirst(EntityPlayer playerIn)` — First layer of player interaction
- `void onActivatorRailPass(int x, int y, int z, boolean receivingPower)` — Called every tick the minecart is on an activator rail.
- `void onDataWatcherUpdate(int dataID)`
- `protected void readEntityFromNBT(NBTTagCompound tagCompund)` — (abstract) Protected helper method to read subclass entity data from NBT.
- `protected void writeEntityToNBT(NBTTagCompound tagCompound)` — (abstract) Protected helper method to write subclass entity data to NBT.

## Fields

- `EntityMinecartCommandBlock`
- `EntityMinecartCommandBlock`