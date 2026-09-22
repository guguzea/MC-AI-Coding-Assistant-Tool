# EntityThrowable

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.projectile.EntityThrowable

## Class signature

```java
public abstract class EntityThrowable extends Entity implements IProjectile
```

## Constructors

- `EntityThrowable(World worldIn)`
- `EntityThrowable(World worldIn, double x, double y, double z)`
- `EntityThrowable(World worldIn, EntityLivingBase throwerIn)`

## Methods

- `protected void entityInit()`
- `protected float getGravityVelocity()` — Gets the amount of gravity to apply to the thrown entity with each tick.
- `protected float getInaccuracy()`
- `EntityLivingBase getThrower()`
- `protected float getVelocity()`
- `boolean isInRangeToRenderDist(double distance)` — Checks if the entity is in range to render by using the past in distance and comparing it to its average edge length * 64 * renderDistanceWeight Args: distance
- `protected abstract void onImpact(MovingObjectPosition p_70184_1_)` — Called when this EntityThrowable hits a block or entity.
- `void onUpdate()` — Called to update the entity's position/logic.
- `void readEntityFromNBT(NBTTagCompound tagCompund)` — (abstract) Protected helper method to read subclass entity data from NBT.
- `void setThrowableHeading(double x, double y, double z, float velocity, float inaccuracy)` — Similar to setArrowHeading, it's point the throwable entity to a x, y, z direction.
- `void setVelocity(double x, double y, double z)` — Sets the velocity to the args.
- `void writeEntityToNBT(NBTTagCompound tagCompound)` — (abstract) Protected helper method to write subclass entity data to NBT.

## Fields

- `protected boolean inGround`
- `int throwableShake`