# EntityBat

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.EntityLiving → net.minecraft.entity.passive.EntityAmbientCreature → net.minecraft.entity.passive.EntityBat

## Class signature

```java
public class EntityBat extends EntityAmbientCreature
```

## Methods

- `protected void applyEntityAttributes()`
- `boolean attackEntityFrom(DamageSource source, float amount)`
- `boolean canBePushed()`
- `protected boolean canTriggerWalking()`
- `protected void collideWithEntity(Entity entityIn)`
- `protected void collideWithNearbyEntities()`
- `boolean doesEntityNotTriggerPressurePlate()`
- `protected void entityInit()`
- `void fall(float distance, float damageMultiplier)`
- `protected SoundEvent getAmbientSound()`
- `boolean getCanSpawnHere()`
- `protected SoundEvent getDeathSound()`
- `float getEyeHeight()`
- `protected SoundEvent getHurtSound()`
- `boolean getIsBatHanging()`
- `protected ResourceLocation getLootTable()`
- `protected float getSoundPitch()`
- `protected float getSoundVolume()`
- `void onUpdate()`
- `void readEntityFromNBT(NBTTagCompound compound)`
- `void setIsBatHanging(boolean isHanging)`
- `protected void updateAITasks()`
- `protected void updateFallState(double y, boolean onGroundIn, IBlockState state, BlockPos pos)`
- `void writeEntityToNBT(NBTTagCompound compound)`

## Fields

- `EntityBat`