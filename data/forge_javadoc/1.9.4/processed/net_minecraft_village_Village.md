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
- `public int getPlayerReputation(java.lang.String playerName)`
- `public int modifyPlayerReputation(java.lang.String playerName, int reputation)`
- `public boolean isPlayerReputationTooLow(java.lang.String playerName)`
- `public void readVillageDataFromNBT( NBTTagCompound compound)`
- `public void writeVillageDataToNBT( NBTTagCompound compound)`
- `public void endMatingSeason()`
- `public boolean isMatingSeason()`
- `public void setDefaultPlayerReputation(int defaultReputation)`