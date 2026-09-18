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
- `protected void func_142017_o(float p_142017_1_)`

## Description

Checks if the entity's current position is a valid location to spawn this entity.