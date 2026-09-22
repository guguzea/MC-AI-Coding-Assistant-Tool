# EntityThrowable

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.projectile.EntityThrowable

## Class signature

```java
public abstract class EntityThrowable extends Entity implements IProjectile
```

## Constructors

- `EntityThrowable(World p_i1776_1_)`
- `EntityThrowable(World p_i1778_1_, double p_i1778_2_, double p_i1778_4_, double p_i1778_6_)`
- `EntityThrowable(World p_i1777_1_, EntityLivingBase p_i1777_2_)`

## Methods

- `protected void entityInit()`
- `protected float func_70182_d()`
- `protected float func_70183_g()`
- `protected float getGravityVelocity()`
- `float getShadowSize()`
- `EntityLivingBase getThrower()`
- `boolean isInRangeToRenderDist(double p_70112_1_)`
- `protected abstract void onImpact(MovingObjectPosition p_70184_1_)`
- `void onUpdate()`
- `void readEntityFromNBT(NBTTagCompound p_70037_1_)`
- `void setThrowableHeading(double p_70186_1_, double p_70186_3_, double p_70186_5_, float p_70186_7_, float p_70186_8_)`
- `void setVelocity(double p_70016_1_, double p_70016_3_, double p_70016_5_)`
- `void writeEntityToNBT(NBTTagCompound p_70014_1_)`

## Fields

- `protected boolean inGround`
- `int throwableShake`