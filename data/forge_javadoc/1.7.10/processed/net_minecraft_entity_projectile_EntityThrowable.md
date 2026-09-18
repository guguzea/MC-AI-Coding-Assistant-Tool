# EntityThrowable

## Class signature

```java
public abstract class EntityThrowable extends Entity implements IProjectile
```

## Constructors

- `public EntityThrowable( World p_i1776_1_)`
- `public EntityThrowable( World p_i1777_1_, EntityLivingBase p_i1777_2_)`
- `public EntityThrowable( World p_i1778_1_, double p_i1778_2_, double p_i1778_4_, double p_i1778_6_)`

## Methods

- `protected void entityInit()`
- `public boolean isInRangeToRenderDist(double p_70112_1_)`
- `protected float func_70182_d()`
- `protected float func_70183_g()`
- `public void setThrowableHeading(double p_70186_1_, double p_70186_3_, double p_70186_5_, float p_70186_7_, float p_70186_8_)`
- `public void setVelocity(double p_70016_1_, double p_70016_3_, double p_70016_5_)`
- `public void onUpdate()`
- `protected float getGravityVelocity()`
- `protected abstract void onImpact( MovingObjectPosition p_70184_1_)`
- `public void writeEntityToNBT( NBTTagCompound p_70014_1_)`
- `public void readEntityFromNBT( NBTTagCompound p_70037_1_)`
- `public float getShadowSize()`
- `public EntityLivingBase getThrower()`