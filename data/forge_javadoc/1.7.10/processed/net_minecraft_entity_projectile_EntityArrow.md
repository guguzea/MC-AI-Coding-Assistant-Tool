# EntityArrow

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.projectile.EntityArrow

## Class signature

```java
public class EntityArrow extends Entity implements IProjectile
```

## Constructors

- `EntityArrow(World p_i1753_1_)`
- `EntityArrow(World p_i1754_1_, double p_i1754_2_, double p_i1754_4_, double p_i1754_6_)`
- `EntityArrow(World p_i1755_1_, EntityLivingBase p_i1755_2_, EntityLivingBase p_i1755_3_, float p_i1755_4_, float p_i1755_5_)`
- `EntityArrow(World p_i1756_1_, EntityLivingBase p_i1756_2_, float p_i1756_3_)`

## Methods

- `boolean canAttackWithItem()`
- `protected boolean canTriggerWalking()`
- `protected void entityInit()`
- `double getDamage()`
- `boolean getIsCritical()`
- `float getShadowSize()`
- `void onCollideWithPlayer(EntityPlayer p_70100_1_)`
- `void onUpdate()`
- `void readEntityFromNBT(NBTTagCompound p_70037_1_)`
- `void setDamage(double p_70239_1_)`
- `void setIsCritical(boolean p_70243_1_)`
- `void setKnockbackStrength(int p_70240_1_)`
- `void setPositionAndRotation2(double p_70056_1_, double p_70056_3_, double p_70056_5_, float p_70056_7_, float p_70056_8_, int p_70056_9_)`
- `void setThrowableHeading(double p_70186_1_, double p_70186_3_, double p_70186_5_, float p_70186_7_, float p_70186_8_)`
- `void setVelocity(double p_70016_1_, double p_70016_3_, double p_70016_5_)`
- `void writeEntityToNBT(NBTTagCompound p_70014_1_)`

## Fields

- `int arrowShake`
- `int canBePickedUp`
- `Entity shootingEntity`