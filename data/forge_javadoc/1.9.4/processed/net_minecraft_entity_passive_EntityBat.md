# EntityBat

## Class signature

```java
public class EntityBat extends EntityAmbientCreature
```

## Constructors

- `public EntityBat( World worldIn)`

## Methods

- `protected void entityInit()`
- `protected float getSoundVolume()`
- `protected float getSoundPitch()`
- `@Nullable protected SoundEvent getAmbientSound()`
- `protected SoundEvent getHurtSound()`
- `protected SoundEvent getDeathSound()`
- `public boolean canBePushed()`
- `protected void collideWithEntity( Entity entityIn)`
- `protected void collideWithNearbyEntities()`
- `protected void applyEntityAttributes()`
- `public boolean getIsBatHanging()`
- `public void setIsBatHanging(boolean isHanging)`
- `public void onUpdate()`
- `protected void updateAITasks()`
- `protected boolean canTriggerWalking()`
- `public void fall(float distance, float damageMultiplier)`
- `protected void updateFallState(double y, boolean onGroundIn, IBlockState state, BlockPos pos)`
- `public boolean doesEntityNotTriggerPressurePlate()`
- `public boolean attackEntityFrom( DamageSource source, float amount)`
- `public void readEntityFromNBT( NBTTagCompound compound)`
- `public void writeEntityToNBT( NBTTagCompound compound)`
- `public boolean getCanSpawnHere()`
- `public float getEyeHeight()`
- `@Nullable protected ResourceLocation getLootTable()`