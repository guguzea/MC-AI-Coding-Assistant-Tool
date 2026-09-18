# EntityWolf

## Class signature

```java
public class EntityWolf extends EntityTameable
```

## Constructors

- `public EntityWolf( World worldIn)`

## Methods

- `protected void initEntityAI()`
- `protected void applyEntityAttributes()`
- `public void setAttackTarget(@Nullable EntityLivingBase entitylivingbaseIn)`
- `protected void updateAITasks()`
- `protected void entityInit()`
- `protected void playStepSound( BlockPos pos, Block blockIn)`
- `public void writeEntityToNBT( NBTTagCompound compound)`
- `public void readEntityFromNBT( NBTTagCompound compound)`
- `protected SoundEvent getAmbientSound()`
- `protected SoundEvent getHurtSound()`
- `protected SoundEvent getDeathSound()`
- `protected float getSoundVolume()`
- `@Nullable protected ResourceLocation getLootTable()`
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
- `public boolean processInteract( EntityPlayer player, EnumHand hand, @Nullable ItemStack stack)`
- `public void handleStatusUpdate(byte id)`
- `public float getTailRotation()`
- `public boolean isBreedingItem(@Nullable ItemStack stack)`
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
- `public boolean canBeLeashedTo( EntityPlayer player)`