# DragonFightManager

**Inheritance:** java.lang.Object → net.minecraft.world.end.DragonFightManager

## Class signature

```java
public class DragonFightManager extends java.lang.Object
```

## Constructors

- `DragonFightManager(WorldServer worldIn, NBTTagCompound compound)`

## Methods

- `void dragonUpdate(EntityDragon dragonIn)`
- `NBTTagCompound getCompound()`
- `int getNumAliveCrystals()`
- `boolean hasPreviouslyKilledDragon()`
- `void onCrystalDestroyed(EntityEnderCrystal crystal, DamageSource dmgSrc)`
- `void processDragonDeath(EntityDragon dragon)`
- `void resetSpikeCrystals()`
- `void respawnDragon()`
- `protected void setRespawnState(DragonSpawnManager state)`
- `void tick()`