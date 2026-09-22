---
title: "DragonFightManager"
description: "public class DragonFightManager extends java.lang.Object"
package: "net/minecraft/world/end"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/world/end/DragonFightManager.html"
sourceType: javadoc
---

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
