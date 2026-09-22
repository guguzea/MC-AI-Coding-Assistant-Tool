---
title: "Village"
description: "public class Village extends java.lang.Object"
package: "net/minecraft/village"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/village/Village.html"
sourceType: javadoc
---

# Village

**Inheritance:** java.lang.Object → net.minecraft.village.Village

## Class signature

```java
public class Village extends java.lang.Object
```

## Constructors

- `Village()`
- `Village(World worldIn)`

## Methods

- `void addOrRenewAgressor(EntityLivingBase entitylivingbaseIn)`
- `void addVillageDoorInfo(VillageDoorInfo doorInfo)`
- `void endMatingSeason()`
- `EntityLivingBase findNearestVillageAggressor(EntityLivingBase entitylivingbaseIn)`
- `BlockPos getCenter()`
- `VillageDoorInfo getDoorInfo(BlockPos pos)`
- `VillageDoorInfo getExistedDoor(BlockPos doorBlock)`
- `VillageDoorInfo getNearestDoor(BlockPos pos)`
- `EntityPlayer getNearestTargetPlayer(EntityLivingBase villageDefender)`
- `int getNumVillageDoors()`
- `int getNumVillagers()`
- `int getPlayerReputation(java.lang.String playerName)`
- `int getTicksSinceLastDoorAdding()`
- `java.util.List<VillageDoorInfo> getVillageDoorInfoList()`
- `int getVillageRadius()`
- `boolean isAnnihilated()`
- `boolean isBlockPosWithinSqVillageRadius(BlockPos pos)`
- `boolean isMatingSeason()`
- `boolean isPlayerReputationTooLow(java.lang.String playerName)`
- `int modifyPlayerReputation(java.lang.String playerName, int reputation)`
- `void readVillageDataFromNBT(NBTTagCompound compound)`
- `void setDefaultPlayerReputation(int defaultReputation)`
- `void setWorld(World worldIn)`
- `void tick(int tickCounterIn)`
- `void writeVillageDataToNBT(NBTTagCompound compound)`
