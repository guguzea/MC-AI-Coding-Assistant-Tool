---
title: "Village"
description: "Prevent villager breeding for a fixed interval of time"
package: "net/minecraft/village"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/village/Village.html"
sourceType: javadoc
---

# Village

## Class signature

```java
public class Village extends java.lang.Object
```

## Constructors

- `public Village()`
- `public Village( World worldIn)`

## Methods

- `public void setWorld( World worldIn)`
- `public void tick(int p_75560_1_)`
- `public BlockPos getCenter()`
- `public int getVillageRadius()`
- `public int getNumVillageDoors()`
- `public int getTicksSinceLastDoorAdding()`
- `public int getNumVillagers()`
- `public boolean func_179866_a( BlockPos pos)`
- `public java.util.List< VillageDoorInfo > getVillageDoorInfoList()`
- `public VillageDoorInfo getNearestDoor( BlockPos pos)`
- `public VillageDoorInfo getDoorInfo( BlockPos pos)`
- `public VillageDoorInfo getExistedDoor( BlockPos doorBlock)`
- `public void addVillageDoorInfo( VillageDoorInfo doorInfo)`
- `public boolean isAnnihilated()`
- `public void addOrRenewAgressor( EntityLivingBase entitylivingbaseIn)`
- `public EntityLivingBase findNearestVillageAggressor( EntityLivingBase entitylivingbaseIn)`
- `public EntityPlayer getNearestTargetPlayer( EntityLivingBase villageDefender)`
- `public int getReputationForPlayer(java.lang.String p_82684_1_)`
- `public int setReputationForPlayer(java.lang.String p_82688_1_, int p_82688_2_)`
- `public boolean isPlayerReputationTooLow(java.lang.String p_82687_1_)`
- `public void readVillageDataFromNBT( NBTTagCompound p_82690_1_)`
- `public void writeVillageDataToNBT( NBTTagCompound p_82689_1_)`
- `public void endMatingSeason()`
- `public boolean isMatingSeason()`
- `public void setDefaultPlayerReputation(int p_82683_1_)`

## Description

Prevent villager breeding for a fixed interval of time
