# TileEntityLockableLoot

## Class signature

```java
public abstract class TileEntityLockableLoot extends TileEntityLockable implements ILootContainer
```

## Constructors

- `public TileEntityLockableLoot()`

## Methods

- `protected boolean checkLootAndRead( NBTTagCompound compound)`
- `protected boolean checkLootAndWrite( NBTTagCompound compound)`
- `protected void fillWithLoot(@Nullable EntityPlayer player)`
- `public ResourceLocation getLootTable()`
- `public void setLootTable( ResourceLocation p_189404_1_, long p_189404_2_)`