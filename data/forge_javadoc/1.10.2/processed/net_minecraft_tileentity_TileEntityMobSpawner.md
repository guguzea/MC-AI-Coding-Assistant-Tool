# TileEntityMobSpawner

## Class signature

```java
public class TileEntityMobSpawner extends TileEntity implements ITickable
```

## Constructors

- `public TileEntityMobSpawner()`

## Methods

- `public static void registerFixesMobSpawner( DataFixer fixer)`
- `public void readFromNBT( NBTTagCompound compound)`
- `public NBTTagCompound writeToNBT( NBTTagCompound compound)`
- `public void update()`
- `@Nullable public SPacketUpdateTileEntity getUpdatePacket()`
- `public NBTTagCompound getUpdateTag()`
- `public boolean receiveClientEvent(int id, int type)`
- `public boolean onlyOpsCanSetNbt()`
- `public MobSpawnerBaseLogic getSpawnerBaseLogic()`