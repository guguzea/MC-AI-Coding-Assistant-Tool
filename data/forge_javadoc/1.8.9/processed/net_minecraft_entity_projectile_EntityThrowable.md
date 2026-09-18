# EntityThrowable

## Class signature

```java
public abstract class EntityThrowable extends Entity implements IProjectile
```

## Constructors

- `public EntityThrowable( World worldIn)`
- `public EntityThrowable( World worldIn, EntityLivingBase throwerIn)`
- `public EntityThrowable( World worldIn, double x, double y, double z)`

## Methods

- `protected void entityInit()`
- `public boolean isInRangeToRenderDist(double distance)`
- `protected float getVelocity()`
- `protected float getInaccuracy()`
- `public void setThrowableHeading(double x, double y, double z, float velocity, float inaccuracy)`
- `public void setVelocity(double x, double y, double z)`
- `public void onUpdate()`
- `protected float getGravityVelocity()`
- `protected abstract void onImpact( MovingObjectPosition p_70184_1_)`
- `public void writeEntityToNBT( NBTTagCompound tagCompound)`
- `public void readEntityFromNBT( NBTTagCompound tagCompund)`
- `public EntityLivingBase getThrower()`

## Description

Gets the amount of gravity to apply to the thrown entity with each tick.