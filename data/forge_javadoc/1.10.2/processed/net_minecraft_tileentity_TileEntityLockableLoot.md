# TileEntityLockableLoot

**Inheritance:** java.lang.Object → net.minecraft.tileentity.TileEntity → net.minecraft.tileentity.TileEntityLockable → net.minecraft.tileentity.TileEntityLockableLoot

## Class signature

```java
public abstract class TileEntityLockableLoot extends TileEntityLockable implements ILootContainer
```

## Constructors

- `TileEntityLockableLoot()`

## Methods

- `protected boolean checkLootAndRead(NBTTagCompound compound)`
- `protected boolean checkLootAndWrite(NBTTagCompound compound)`
- `protected void fillWithLoot(EntityPlayer player)`
- `ResourceLocation getLootTable()`
- `void setLootTable(ResourceLocation p_189404_1_, long p_189404_2_)`

## Fields

- `protected ResourceLocation lootTable`
- `protected long lootTableSeed`