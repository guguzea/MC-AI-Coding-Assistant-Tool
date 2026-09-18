# EntityFlying

## Class signature

```java
public abstract class EntityFlying extends EntityLiving
```

## Constructors

- `public EntityFlying( World worldIn)`

## Methods

- `public void fall(float distance, float damageMultiplier)`
- `protected void updateFallState(double y, boolean onGroundIn, IBlockState state, BlockPos pos)`
- `public void travel(float strafe, float vertical, float forward)`
- `public boolean isOnLadder()`