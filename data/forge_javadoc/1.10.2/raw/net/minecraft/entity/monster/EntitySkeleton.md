---
title: "EntitySkeleton"
description: "public class EntitySkeleton extends EntityMob implements IRangedAttackMob"
package: "net/minecraft/entity/monster"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/entity/monster/EntitySkeleton.html"
sourceType: javadoc
---

# EntitySkeleton

## Class signature

```java
public class EntitySkeleton extends EntityMob implements IRangedAttackMob
```

## Constructors

- `public EntitySkeleton( World worldIn)`

## Methods

- `protected void initEntityAI()`
- `protected void applyEntityAttributes()`
- `protected void entityInit()`
- `protected SoundEvent getAmbientSound()`
- `protected SoundEvent getHurtSound()`
- `protected SoundEvent getDeathSound()`
- `protected void playStepSound( BlockPos pos, Block blockIn)`
- `public boolean attackEntityAsMob( Entity entityIn)`
- `public EnumCreatureAttribute getCreatureAttribute()`
- `public void onLivingUpdate()`
- `public void updateRidden()`
- `public void onDeath( DamageSource cause)`
- `@Nullable protected ResourceLocation getLootTable()`
- `protected void setEquipmentBasedOnDifficulty( DifficultyInstance difficulty)`
- `@Nullable public IEntityLivingData onInitialSpawn( DifficultyInstance difficulty, @Nullable IEntityLivingData livingdata)`
- `public void setCombatTask()`
- `public void attackEntityWithRangedAttack( EntityLivingBase target, float distanceFactor)`
- `public SkeletonType getSkeletonType()`
- `public void setSkeletonType( SkeletonType type)`
- `public static void registerFixesSkeleton( DataFixer fixer)`
- `public void readEntityFromNBT( NBTTagCompound compound)`
- `public void writeEntityToNBT( NBTTagCompound compound)`
- `public void setItemStackToSlot( EntityEquipmentSlot slotIn, @Nullable ItemStack stack)`
- `public float getEyeHeight()`
- `public double getYOffset()`
- `public boolean isSwingingArms()`
- `public void setSwingingArms(boolean swingingArms)`
