---
title: "Village"
description: "public class Village extends java.lang.Object"
package: "net/minecraft/village"
version: "1.7.10"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/net/minecraft/village/Village.html"
sourceType: javadoc
---

# Village

## Class signature

```java
public class Village extends java.lang.Object
```

## Constructors

- `public Village()`
- `public Village( World p_i1675_1_)`

## Methods

- `public void func_82691_a( World p_82691_1_)`
- `public void tick(int p_75560_1_)`
- `public ChunkCoordinates getCenter()`
- `public int getVillageRadius()`
- `public int getNumVillageDoors()`
- `public int getTicksSinceLastDoorAdding()`
- `public int getNumVillagers()`
- `public boolean isInRange(int p_75570_1_, int p_75570_2_, int p_75570_3_)`
- `public java.util.List getVillageDoorInfoList()`
- `public VillageDoorInfo findNearestDoor(int p_75564_1_, int p_75564_2_, int p_75564_3_)`
- `public VillageDoorInfo findNearestDoorUnrestricted(int p_75569_1_, int p_75569_2_, int p_75569_3_)`
- `public VillageDoorInfo getVillageDoorAt(int p_75578_1_, int p_75578_2_, int p_75578_3_)`
- `public void addVillageDoorInfo( VillageDoorInfo p_75576_1_)`
- `public boolean isAnnihilated()`
- `public void addOrRenewAgressor( EntityLivingBase p_75575_1_)`
- `public EntityLivingBase findNearestVillageAggressor( EntityLivingBase p_75571_1_)`
- `public EntityPlayer func_82685_c( EntityLivingBase p_82685_1_)`
- `public int getReputationForPlayer(java.lang.String p_82684_1_)`
- `public int setReputationForPlayer(java.lang.String p_82688_1_, int p_82688_2_)`
- `public boolean isPlayerReputationTooLow(java.lang.String p_82687_1_)`
- `public void readVillageDataFromNBT( NBTTagCompound p_82690_1_)`
- `public void writeVillageDataToNBT( NBTTagCompound p_82689_1_)`
- `public void endMatingSeason()`
- `public boolean isMatingSeason()`
- `public void setDefaultPlayerReputation(int p_82683_1_)`
