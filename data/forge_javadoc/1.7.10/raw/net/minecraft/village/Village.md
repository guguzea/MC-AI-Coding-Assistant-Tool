---
title: "Village"
description: "public class Village extends java.lang.Object"
package: "net/minecraft/village"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/net/minecraft/village/Village.html"
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
- `Village(World p_i1675_1_)`

## Methods

- `void addOrRenewAgressor(EntityLivingBase p_75575_1_)`
- `void addVillageDoorInfo(VillageDoorInfo p_75576_1_)`
- `void endMatingSeason()`
- `VillageDoorInfo findNearestDoor(int p_75564_1_, int p_75564_2_, int p_75564_3_)`
- `VillageDoorInfo findNearestDoorUnrestricted(int p_75569_1_, int p_75569_2_, int p_75569_3_)`
- `EntityLivingBase findNearestVillageAggressor(EntityLivingBase p_75571_1_)`
- `EntityPlayer func_82685_c(EntityLivingBase p_82685_1_)`
- `void func_82691_a(World p_82691_1_)`
- `ChunkCoordinates getCenter()`
- `int getNumVillageDoors()`
- `int getNumVillagers()`
- `int getReputationForPlayer(java.lang.String p_82684_1_)`
- `int getTicksSinceLastDoorAdding()`
- `VillageDoorInfo getVillageDoorAt(int p_75578_1_, int p_75578_2_, int p_75578_3_)`
- `java.util.List getVillageDoorInfoList()`
- `int getVillageRadius()`
- `boolean isAnnihilated()`
- `boolean isInRange(int p_75570_1_, int p_75570_2_, int p_75570_3_)`
- `boolean isMatingSeason()`
- `boolean isPlayerReputationTooLow(java.lang.String p_82687_1_)`
- `void readVillageDataFromNBT(NBTTagCompound p_82690_1_)`
- `void setDefaultPlayerReputation(int p_82683_1_)`
- `int setReputationForPlayer(java.lang.String p_82688_1_, int p_82688_2_)`
- `void tick(int p_75560_1_)`
- `void writeVillageDataToNBT(NBTTagCompound p_82689_1_)`
