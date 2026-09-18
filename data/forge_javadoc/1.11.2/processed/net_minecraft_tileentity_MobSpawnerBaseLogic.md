# MobSpawnerBaseLogic

## Class signature

```java
public abstract class MobSpawnerBaseLogic extends java.lang.Object
```

## Constructors

- `public MobSpawnerBaseLogic()`

## Methods

- `public void setEntityId(@Nullable ResourceLocation id)`
- `public void updateSpawner()`
- `public void readFromNBT( NBTTagCompound nbt)`
- `public NBTTagCompound writeToNBT( NBTTagCompound p_189530_1_)`
- `public boolean setDelayToMin(int delay)`
- `public Entity getCachedEntity()`
- `public void setNextSpawnData( WeightedSpawnerEntity p_184993_1_)`
- `public abstract void broadcastEvent(int id)`
- `public abstract World getSpawnerWorld()`
- `public abstract BlockPos getSpawnerPosition()`
- `public double getMobRotation()`
- `public double getPrevMobRotation()`