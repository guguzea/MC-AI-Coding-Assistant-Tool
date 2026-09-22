# TileEntityMobSpawner

**Inheritance:** java.lang.Object → net.minecraft.tileentity.TileEntity → net.minecraft.tileentity.TileEntityMobSpawner

## Class signature

```java
public class TileEntityMobSpawner extends TileEntity implements ITickable
```

## Methods

- `boolean func_183000_F()`
- `Packet getDescriptionPacket()` — Allows for a specialized description packet to be created.
- `MobSpawnerBaseLogic getSpawnerBaseLogic()`
- `void readFromNBT(NBTTagCompound compound)`
- `boolean receiveClientEvent(int id, int type)`
- `void update()` — Like the old updateEntity(), except more generic.
- `void writeToNBT(NBTTagCompound compound)`

## Fields

- `TileEntityMobSpawner`