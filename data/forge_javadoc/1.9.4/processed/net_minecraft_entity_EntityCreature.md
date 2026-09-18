# EntityCreature

## Class signature

```java
public abstract class EntityCreature extends EntityLiving
```

## Constructors

- `public EntityCreature( World worldIn)`

## Methods

- `public float getBlockPathWeight( BlockPos pos)`
- `public boolean getCanSpawnHere()`
- `public boolean hasPath()`
- `public boolean isWithinHomeDistanceCurrentPosition()`
- `public boolean isWithinHomeDistanceFromPosition( BlockPos pos)`
- `public void setHomePosAndDistance( BlockPos pos, int distance)`
- `public BlockPos getHomePosition()`
- `public float getMaximumHomeDistance()`
- `public void detachHome()`
- `public boolean hasHome()`
- `protected void updateLeashedState()`
- `protected void onLeashDistance(float p_142017_1_)`