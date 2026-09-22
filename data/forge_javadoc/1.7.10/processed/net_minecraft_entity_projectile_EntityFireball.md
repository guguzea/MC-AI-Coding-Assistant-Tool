# EntityFireball

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.projectile.EntityFireball

## Class signature

```java
public abstract class EntityFireball extends Entity
```

## Constructors

- `EntityFireball(World p_i1759_1_)`
- `EntityFireball(World p_i1760_1_, double p_i1760_2_, double p_i1760_4_, double p_i1760_6_, double p_i1760_8_, double p_i1760_10_, double p_i1760_12_)`
- `EntityFireball(World p_i1761_1_, EntityLivingBase p_i1761_2_, double p_i1761_3_, double p_i1761_5_, double p_i1761_7_)`

## Methods

- `boolean attackEntityFrom(DamageSource p_70097_1_, float p_70097_2_)`
- `boolean canBeCollidedWith()`
- `protected void entityInit()`
- `float getBrightness(float p_70013_1_)`
- `int getBrightnessForRender(float p_70070_1_)`
- `float getCollisionBorderSize()`
- `protected float getMotionFactor()`
- `float getShadowSize()`
- `boolean isInRangeToRenderDist(double p_70112_1_)`
- `protected abstract void onImpact(MovingObjectPosition p_70227_1_)`
- `void onUpdate()`
- `void readEntityFromNBT(NBTTagCompound p_70037_1_)`
- `void writeEntityToNBT(NBTTagCompound p_70014_1_)`

## Fields

- `double accelerationX`
- `double accelerationY`
- `double accelerationZ`
- `EntityLivingBase shootingEntity`