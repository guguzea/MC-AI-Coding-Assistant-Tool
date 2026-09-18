---
title: "DragonFightManager"
description: "public class DragonFightManager extends java.lang.Object"
package: "net/minecraft/world/end"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/world/end/DragonFightManager.html"
sourceType: javadoc
---

# DragonFightManager

## Class signature

```java
public class DragonFightManager extends java.lang.Object
```

## Constructors

- `public DragonFightManager( WorldServer worldIn, NBTTagCompound compound)`

## Methods

- `public NBTTagCompound getCompound()`
- `public void tick()`
- `protected void setRespawnState( DragonSpawnManager state)`
- `public void processDragonDeath( EntityDragon dragon)`
- `public void dragonUpdate( EntityDragon dragonIn)`
- `public int getNumAliveCrystals()`
- `public void onCrystalDestroyed( EntityEnderCrystal crystal, DamageSource dmgSrc)`
- `public boolean hasPreviouslyKilledDragon()`
- `public void respawnDragon()`
- `public void resetSpikeCrystals()`
