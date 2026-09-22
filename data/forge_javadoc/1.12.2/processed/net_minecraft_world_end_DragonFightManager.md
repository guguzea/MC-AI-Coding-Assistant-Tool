# DragonFightManager

**Inheritance:** java.lang.Object → net.minecraft.world.end.DragonFightManager

## Class signature

```java
public class DragonFightManager extends java.lang.Object
```

## Constructors

- `DragonFightManager(WorldServer worldIn, NBTTagCompound compound)`

## Methods

- `void addPlayer(EntityPlayerMP player)`
- `void dragonUpdate(EntityDragon dragonIn)`
- `NBTTagCompound getCompound()`
- `int getNumAliveCrystals()`
- `boolean hasPreviouslyKilledDragon()`
- `void onCrystalDestroyed(EntityEnderCrystal crystal, DamageSource dmgSrc)`
- `void processDragonDeath(EntityDragon dragon)`
- `void removePlayer(EntityPlayerMP player)`
- `void resetSpikeCrystals()`
- `void respawnDragon()`
- `protected void setRespawnState(DragonSpawnManager state)`
- `void tick()`