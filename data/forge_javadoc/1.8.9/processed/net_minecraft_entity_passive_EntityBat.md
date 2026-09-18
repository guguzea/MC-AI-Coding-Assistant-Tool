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
- `protected java.lang.String getLivingSound()`
- `protected java.lang.String getHurtSound()`
- `protected java.lang.String getDeathSound()`
- `public boolean canBePushed()`
- `protected void collideWithEntity( Entity p_82167_1_)`
- `protected void collideWithNearbyEntities()`
- `protected void applyEntityAttributes()`
- `public boolean getIsBatHanging()`
- `public void setIsBatHanging(boolean isHanging)`
- `public void onUpdate()`
- `protected void updateAITasks()`
- `protected boolean canTriggerWalking()`
- `public void fall(float distance, float damageMultiplier)`
- `protected void updateFallState(double y, boolean onGroundIn, Block blockIn, BlockPos pos)`
- `public boolean doesEntityNotTriggerPressurePlate()`
- `public boolean attackEntityFrom( DamageSource source, float amount)`
- `public void readEntityFromNBT( NBTTagCompound tagCompund)`
- `public void writeEntityToNBT( NBTTagCompound tagCompound)`
- `public boolean getCanSpawnHere()`
- `public float getEyeHeight()`

## Description

Called when the entity is attacked.