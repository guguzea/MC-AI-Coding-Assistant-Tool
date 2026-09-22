# MobSpawnerBaseLogic

**Inheritance:** java.lang.Object → net.minecraft.tileentity.MobSpawnerBaseLogic

## Class signature

```java
public abstract class MobSpawnerBaseLogic extends java.lang.Object
```

## Constructors

- `MobSpawnerBaseLogic()`

## Methods

- `abstract void broadcastEvent(int id)`
- `Entity getCachedEntity()`
- `double getMobRotation()`
- `double getPrevMobRotation()`
- `Entity getSpawnerEntity()`
- `abstract BlockPos getSpawnerPosition()`
- `abstract World getSpawnerWorld()`
- `void readFromNBT(NBTTagCompound nbt)`
- `boolean setDelayToMin(int delay)`
- `void setEntityId(ResourceLocation id)`
- `void setNextSpawnData(WeightedSpawnerEntity p_184993_1_)`
- `void updateSpawner()`
- `NBTTagCompound writeToNBT(NBTTagCompound p_189530_1_)`