# EntityFireball

## Class signature

```java
public abstract class EntityFireball extends Entity
```

## Constructors

- `public EntityFireball( World worldIn)`
- `public EntityFireball( World worldIn, double x, double y, double z, double accelX, double accelY, double accelZ)`
- `public EntityFireball( World worldIn, EntityLivingBase shooter, double accelX, double accelY, double accelZ)`

## Methods

- `protected void entityInit()`
- `public boolean isInRangeToRenderDist(double distance)`
- `public void onUpdate()`
- `protected float getMotionFactor()`
- `protected abstract void onImpact( MovingObjectPosition movingObject)`
- `public void writeEntityToNBT( NBTTagCompound tagCompound)`
- `public void readEntityFromNBT( NBTTagCompound tagCompund)`
- `public boolean canBeCollidedWith()`
- `public float getCollisionBorderSize()`
- `public boolean attackEntityFrom( DamageSource source, float amount)`
- `public float getBrightness(float partialTicks)`
- `public int getBrightnessForRender(float partialTicks)`

## Description

Called when the entity is attacked.