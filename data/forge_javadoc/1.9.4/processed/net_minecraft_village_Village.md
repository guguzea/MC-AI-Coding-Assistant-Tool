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