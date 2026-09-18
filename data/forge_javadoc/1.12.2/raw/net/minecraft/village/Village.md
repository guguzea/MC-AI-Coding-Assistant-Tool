---
title: "Village"
description: "Retrieves the handler for the capability requested on the specific side."
package: "net/minecraft/village"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/village/Village.html"
sourceType: javadoc
---

# Village

## Class signature

```java
public class Village extends java.lang.Object implements ICapabilitySerializable < NBTTagCompound >
```

## Constructors

- `public Village()`
- `public Village( World worldIn)`

## Methods

- `public void setWorld( World worldIn)`
- `public void tick(int tickCounterIn)`
- `public BlockPos getCenter()`
- `public int getVillageRadius()`
- `public int getNumVillageDoors()`
- `public int getTicksSinceLastDoorAdding()`
- `public int getNumVillagers()`
- `public boolean isBlockPosWithinSqVillageRadius( BlockPos pos)`
- `public java.util.List< VillageDoorInfo > getVillageDoorInfoList()`
- `public VillageDoorInfo getNearestDoor( BlockPos pos)`
- `public VillageDoorInfo getDoorInfo( BlockPos pos)`
- `public VillageDoorInfo getExistedDoor( BlockPos doorBlock)`
- `public void addVillageDoorInfo( VillageDoorInfo doorInfo)`
- `public boolean isAnnihilated()`
- `public void addOrRenewAgressor( EntityLivingBase entitylivingbaseIn)`
- `public EntityLivingBase findNearestVillageAggressor( EntityLivingBase entitylivingbaseIn)`
- `public EntityPlayer getNearestTargetPlayer( EntityLivingBase villageDefender)`
- `@Deprecated public int getPlayerReputation(java.lang.String playerName)`
- `public int getPlayerReputation(java.util.UUID playerName)`
- `@Deprecated public int modifyPlayerReputation(java.lang.String playerName, int reputation)`
- `public int modifyPlayerReputation(java.util.UUID playerName, int reputation)`
- `@Deprecated public boolean isPlayerReputationTooLow(java.lang.String playerName)`
- `public boolean isPlayerReputationTooLow(java.util.UUID uuid)`
- `public void readVillageDataFromNBT( NBTTagCompound compound)`
- `public void writeVillageDataToNBT( NBTTagCompound compound)`
- `public void endMatingSeason()`
- `public boolean isMatingSeason()`
- `public void setDefaultPlayerReputation(int defaultReputation)`
- `public boolean hasCapability( Capability <?> capability, EnumFacing facing)`
- `public <T> T getCapability( Capability <T> capability, EnumFacing facing)`
- `public void deserializeNBT( NBTTagCompound nbt)`
- `public NBTTagCompound serializeNBT()`

## Description

Retrieves the handler for the capability requested on the specific side.
