# EntityWitherSkull

## Class signature

```java
public class EntityWitherSkull extends EntityFireball
```

## Constructors

- `public EntityWitherSkull( World worldIn)`
- `public EntityWitherSkull( World worldIn, EntityLivingBase shooter, double accelX, double accelY, double accelZ)`
- `public EntityWitherSkull( World worldIn, double x, double y, double z, double accelX, double accelY, double accelZ)`

## Methods

- `protected float getMotionFactor()`
- `public boolean isBurning()`
- `public float getExplosionResistance( Explosion explosionIn, World worldIn, BlockPos pos, IBlockState blockStateIn)`
- `protected void onImpact( MovingObjectPosition movingObject)`
- `public boolean canBeCollidedWith()`
- `public boolean attackEntityFrom( DamageSource source, float amount)`
- `protected void entityInit()`
- `public boolean isInvulnerable()`
- `public void setInvulnerable(boolean invulnerable)`

## Description

Called when the entity is attacked.