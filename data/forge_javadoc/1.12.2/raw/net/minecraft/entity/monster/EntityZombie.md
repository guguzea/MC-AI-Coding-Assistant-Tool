---
title: "EntityZombie"
description: "public class EntityZombie extends EntityMob"
package: "net/minecraft/entity/monster"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/entity/monster/EntityZombie.html"
sourceType: javadoc
---

# EntityZombie

## Class signature

```java
public class EntityZombie extends EntityMob
```

## Constructors

- `public EntityZombie( World worldIn)`

## Methods

- `protected void initEntityAI()`
- `protected void applyEntityAI()`
- `protected void applyEntityAttributes()`
- `protected void entityInit()`
- `public void setArmsRaised(boolean armsRaised)`
- `public boolean isArmsRaised()`
- `public boolean isBreakDoorsTaskSet()`
- `public void setBreakDoorsAItask(boolean enabled)`
- `public boolean isChild()`
- `protected int getExperiencePoints( EntityPlayer player)`
- `public void setChild(boolean childZombie)`
- `public void notifyDataManagerChange( DataParameter <?> key)`
- `public void onLivingUpdate()`
- `protected boolean shouldBurnInDay()`
- `public boolean attackEntityFrom( DamageSource source, float amount)`
- `public boolean attackEntityAsMob( Entity entityIn)`
- `protected SoundEvent getAmbientSound()`
- `protected SoundEvent getHurtSound( DamageSource damageSourceIn)`
- `protected SoundEvent getDeathSound()`
- `protected SoundEvent getStepSound()`
- `protected void playStepSound( BlockPos pos, Block blockIn)`
- `public EnumCreatureAttribute getCreatureAttribute()`
- `protected ResourceLocation getLootTable()`
- `protected void setEquipmentBasedOnDifficulty( DifficultyInstance difficulty)`
- `public static void registerFixesZombie( DataFixer fixer)`
- `public void writeEntityToNBT( NBTTagCompound compound)`
- `public void readEntityFromNBT( NBTTagCompound compound)`
- `public void onKillEntity( EntityLivingBase entityLivingIn)`
- `public float getEyeHeight()`
- `protected boolean canEquipItem( ItemStack stack)`
- `public IEntityLivingData onInitialSpawn( DifficultyInstance difficulty, IEntityLivingData livingdata)`
- `public void setChildSize(boolean isChild)`
- `protected final void setSize(float width, float height)`
- `protected final void multiplySize(float size)`
- `public double getYOffset()`
- `public void onDeath( DamageSource cause)`
- `protected ItemStack getSkullDrop()`
