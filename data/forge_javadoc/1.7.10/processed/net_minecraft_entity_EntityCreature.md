# EntityCreature

## Class signature

```java
public abstract class EntityCreature extends EntityLiving
```

## Constructors

- `public EntityCreature( World p_i1602_1_)`

## Methods

- `protected boolean isMovementCeased()`
- `protected void updateEntityActionState()`
- `protected void updateWanderPath()`
- `protected void attackEntity( Entity p_70785_1_, float p_70785_2_)`
- `public float getBlockPathWeight(int p_70783_1_, int p_70783_2_, int p_70783_3_)`
- `protected Entity findPlayerToAttack()`
- `public boolean getCanSpawnHere()`
- `public boolean hasPath()`
- `public void setPathToEntity( PathEntity p_70778_1_)`
- `public Entity getEntityToAttack()`
- `public void setTarget( Entity p_70784_1_)`
- `public boolean isWithinHomeDistanceCurrentPosition()`
- `public boolean isWithinHomeDistance(int p_110176_1_, int p_110176_2_, int p_110176_3_)`
- `public void setHomeArea(int p_110171_1_, int p_110171_2_, int p_110171_3_, int p_110171_4_)`
- `public ChunkCoordinates getHomePosition()`
- `public float func_110174_bM()`
- `public void detachHome()`
- `public boolean hasHome()`
- `protected void updateLeashedState()`
- `protected void func_142017_o(float p_142017_1_)`