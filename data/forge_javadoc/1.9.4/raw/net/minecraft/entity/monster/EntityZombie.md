---
title: "EntityZombie"
description: "public class EntityZombie extends EntityMob"
package: "net/minecraft/entity/monster"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/entity/monster/EntityZombie.html"
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
- `public boolean isVillager()`
- `public int getVillagerType()`
- `public void setVillagerType(int villagerType)`
- `public void setToNotVillager()`
- `public void notifyDataManagerChange( DataParameter <?> key)`
- `public void onLivingUpdate()`
- `public boolean attackEntityFrom( DamageSource source, float amount)`
- `public void onUpdate()`
- `public boolean attackEntityAsMob( Entity entityIn)`
- `protected SoundEvent getAmbientSound()`
- `protected SoundEvent getHurtSound()`
- `protected SoundEvent getDeathSound()`
- `protected void playStepSound( BlockPos pos, Block blockIn)`
- `public EnumCreatureAttribute getCreatureAttribute()`
- `@Nullable protected ResourceLocation getLootTable()`
- `protected void setEquipmentBasedOnDifficulty( DifficultyInstance difficulty)`
- `public void writeEntityToNBT( NBTTagCompound compound)`
- `public void readEntityFromNBT( NBTTagCompound compound)`
- `public void onKillEntity( EntityLivingBase entityLivingIn)`
- `public float getEyeHeight()`
- `protected boolean canEquipItem( ItemStack stack)`
- `@Nullable public IEntityLivingData onInitialSpawn( DifficultyInstance difficulty, @Nullable IEntityLivingData livingdata)`
- `public boolean processInteract( EntityPlayer player, EnumHand hand, @Nullable ItemStack stack)`
- `protected void startConversion(int ticks)`
- `public void handleStatusUpdate(byte id)`
- `protected boolean canDespawn()`
- `public boolean isConverting()`
- `protected void convertToVillager()`
- `protected int getConversionTimeBoost()`
- `public void setChildSize(boolean isChild)`
- `protected final void setSize(float width, float height)`
- `protected final void multiplySize(float size)`
- `public double getYOffset()`
- `public void onDeath( DamageSource cause)`
