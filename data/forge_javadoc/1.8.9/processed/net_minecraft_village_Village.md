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
- `void endMatingSeason()` — Prevent villager breeding for a fixed interval of time
- `EntityLivingBase findNearestVillageAggressor(EntityLivingBase entitylivingbaseIn)`
- `boolean func_179866_a(BlockPos pos)`
- `BlockPos getCenter()`
- `VillageDoorInfo getDoorInfo(BlockPos pos)` — Returns VillageDoorInfo from given block position
- `VillageDoorInfo getExistedDoor(BlockPos doorBlock)` — if door not existed in this village, null will be returned
- `VillageDoorInfo getNearestDoor(BlockPos pos)`
- `EntityPlayer getNearestTargetPlayer(EntityLivingBase villageDefender)`
- `int getNumVillageDoors()` — Actually get num village door info entries, but that boils down to number of doors.
- `int getNumVillagers()`
- `int getReputationForPlayer(java.lang.String p_82684_1_)` — Return the village reputation for a player
- `int getTicksSinceLastDoorAdding()`
- `java.util.List<VillageDoorInfo> getVillageDoorInfoList()`
- `int getVillageRadius()`
- `boolean isAnnihilated()` — Returns true, if there is not a single village door left.
- `boolean isMatingSeason()` — Return whether villagers mating refractory period has passed
- `boolean isPlayerReputationTooLow(java.lang.String p_82687_1_)` — Return whether this player has a too low reputation with this village.
- `void readVillageDataFromNBT(NBTTagCompound p_82690_1_)` — Read this village's data from NBT.
- `void setDefaultPlayerReputation(int p_82683_1_)`
- `int setReputationForPlayer(java.lang.String p_82688_1_, int p_82688_2_)` — Set the village reputation for a player.
- `void setWorld(World worldIn)`
- `void tick(int p_75560_1_)` — Called periodically by VillageCollection
- `void writeVillageDataToNBT(NBTTagCompound p_82689_1_)` — Write this village's data to NBT.