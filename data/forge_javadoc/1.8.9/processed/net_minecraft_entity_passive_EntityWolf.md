# EntityWolf

## Class signature

```java
public class EntityWolf extends EntityTameable
```

## Constructors

- `public EntityWolf( World worldIn)`

## Methods

- `protected void applyEntityAttributes()`
- `public void setAttackTarget( EntityLivingBase entitylivingbaseIn)`
- `protected void updateAITasks()`
- `protected void entityInit()`
- `protected void playStepSound( BlockPos pos, Block blockIn)`
- `public void writeEntityToNBT( NBTTagCompound tagCompound)`
- `public void readEntityFromNBT( NBTTagCompound tagCompund)`
- `protected java.lang.String getLivingSound()`
- `protected java.lang.String getHurtSound()`
- `protected java.lang.String getDeathSound()`
- `protected float getSoundVolume()`
- `protected Item getDropItem()`
- `public void onLivingUpdate()`
- `public void onUpdate()`
- `public boolean isWolfWet()`
- `public float getShadingWhileWet(float p_70915_1_)`
- `public float getShakeAngle(float p_70923_1_, float p_70923_2_)`
- `public float getInterestedAngle(float p_70917_1_)`
- `public float getEyeHeight()`
- `public int getVerticalFaceSpeed()`
- `public boolean attackEntityFrom( DamageSource source, float amount)`
- `public boolean attackEntityAsMob( Entity entityIn)`
- `public void setTamed(boolean tamed)`
- `public boolean interact( EntityPlayer player)`
- `public void handleStatusUpdate(byte id)`
- `public float getTailRotation()`
- `public boolean isBreedingItem( ItemStack stack)`
- `public int getMaxSpawnedInChunk()`
- `public boolean isAngry()`
- `public void setAngry(boolean angry)`
- `public EnumDyeColor getCollarColor()`
- `public void setCollarColor( EnumDyeColor collarcolor)`
- `public EntityWolf createChild( EntityAgeable ageable)`
- `public void setBegging(boolean beg)`
- `public boolean canMateWith( EntityAnimal otherAnimal)`
- `public boolean isBegging()`
- `protected boolean canDespawn()`
- `public boolean shouldAttackEntity( EntityLivingBase p_142018_1_, EntityLivingBase p_142018_2_)`
- `public boolean allowLeashing()`

## Description

Called when the entity is attacked.