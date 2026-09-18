---
title: "EntityParrot"
description: "public class EntityParrot extends EntityShoulderRiding implements EntityFlying"
package: "net/minecraft/entity/passive"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/entity/passive/EntityParrot.html"
sourceType: javadoc
---

# EntityParrot

## Class signature

```java
public class EntityParrot extends EntityShoulderRiding implements EntityFlying
```

## Constructors

- `public EntityParrot( World worldIn)`

## Methods

- `public IEntityLivingData onInitialSpawn( DifficultyInstance difficulty, IEntityLivingData livingdata)`
- `protected void initEntityAI()`
- `protected void applyEntityAttributes()`
- `protected PathNavigate createNavigator( World worldIn)`
- `public float getEyeHeight()`
- `public void onLivingUpdate()`
- `public void setPartying( BlockPos pos, boolean p_191987_2_)`
- `public boolean isPartying()`
- `public boolean processInteract( EntityPlayer player, EnumHand hand)`
- `public boolean isBreedingItem( ItemStack stack)`
- `public boolean getCanSpawnHere()`
- `public void fall(float distance, float damageMultiplier)`
- `protected void updateFallState(double y, boolean onGroundIn, IBlockState state, BlockPos pos)`
- `public boolean canMateWith( EntityAnimal otherAnimal)`
- `public EntityAgeable createChild( EntityAgeable ageable)`
- `public static void playAmbientSound( World worldIn, Entity p_192005_1_)`
- `public boolean attackEntityAsMob( Entity entityIn)`
- `public SoundEvent getAmbientSound()`
- `protected SoundEvent getHurtSound( DamageSource damageSourceIn)`
- `protected SoundEvent getDeathSound()`
- `protected void playStepSound( BlockPos pos, Block blockIn)`
- `protected float playFlySound(float p_191954_1_)`
- `protected boolean makeFlySound()`
- `protected float getSoundPitch()`
- `public SoundCategory getSoundCategory()`
- `public boolean canBePushed()`
- `protected void collideWithEntity( Entity entityIn)`
- `public boolean attackEntityFrom( DamageSource source, float amount)`
- `public int getVariant()`
- `public void setVariant(int p_191997_1_)`
- `protected void entityInit()`
- `public void writeEntityToNBT( NBTTagCompound compound)`
- `public void readEntityFromNBT( NBTTagCompound compound)`
- `protected ResourceLocation getLootTable()`
- `public boolean isFlying()`
- `public static void registerMimicSound(java.lang.Class<? extends Entity > cls, SoundEvent sound)`
