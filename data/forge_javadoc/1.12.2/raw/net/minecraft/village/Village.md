---
title: "Village"
description: "public class Village extends java.lang.Object implements ICapabilitySerializable<NBTTagCompound>"
package: "net/minecraft/village"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/village/Village.html"
sourceType: javadoc
---

# Village

**Inheritance:** java.lang.Object → net.minecraft.village.Village

## Class signature

```java
public class Village extends java.lang.Object implements ICapabilitySerializable<NBTTagCompound>
```

## Constructors

- `Village()`
- `Village(World worldIn)`

## Methods

- `void addOrRenewAgressor(EntityLivingBase entitylivingbaseIn)`
- `void addVillageDoorInfo(VillageDoorInfo doorInfo)`
- `void deserializeNBT(NBTTagCompound nbt)`
- `void endMatingSeason()`
- `EntityLivingBase findNearestVillageAggressor(EntityLivingBase entitylivingbaseIn)`
- `<T> T getCapability(Capability<T> capability, EnumFacing facing)` — Retrieves the handler for the capability requested on the specific side.
- `BlockPos getCenter()`
- `VillageDoorInfo getDoorInfo(BlockPos pos)`
- `VillageDoorInfo getExistedDoor(BlockPos doorBlock)`
- `VillageDoorInfo getNearestDoor(BlockPos pos)`
- `EntityPlayer getNearestTargetPlayer(EntityLivingBase villageDefender)`
- `int getNumVillageDoors()`
- `int getNumVillagers()`
- `@Deprecated int getPlayerReputation(java.lang.String playerName)`
- `int getPlayerReputation(java.util.UUID playerName)`
- `int getTicksSinceLastDoorAdding()`
- `java.util.List<VillageDoorInfo> getVillageDoorInfoList()`
- `int getVillageRadius()`
- `boolean hasCapability(Capability<?> capability, EnumFacing facing)` — Determines if this object has support for the capability in question on the specific side.
- `boolean isAnnihilated()`
- `boolean isBlockPosWithinSqVillageRadius(BlockPos pos)`
- `boolean isMatingSeason()`
- `@Deprecated boolean isPlayerReputationTooLow(java.lang.String playerName)`
- `boolean isPlayerReputationTooLow(java.util.UUID uuid)`
- `@Deprecated int modifyPlayerReputation(java.lang.String playerName, int reputation)`
- `int modifyPlayerReputation(java.util.UUID playerName, int reputation)`
- `void readVillageDataFromNBT(NBTTagCompound compound)`
- `NBTTagCompound serializeNBT()`
- `void setDefaultPlayerReputation(int defaultReputation)`
- `void setWorld(World worldIn)`
- `void tick(int tickCounterIn)`
- `void writeVillageDataToNBT(NBTTagCompound compound)`
