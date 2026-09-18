---
title: "EntityZombie"
description: "The attribute which determines the chance that this mob will spawn reinforcements"
package: "net/minecraft/entity/monster"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/monster/EntityZombie.html"
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

- `protected void applyEntityAI()`
- `protected void applyEntityAttributes()`
- `protected void entityInit()`
- `public int getTotalArmorValue()`
- `public boolean isBreakDoorsTaskSet()`
- `public void setBreakDoorsAItask(boolean par1)`
- `public boolean isChild()`
- `protected int getExperiencePoints( EntityPlayer player)`
- `public void setChild(boolean childZombie)`
- `public boolean isVillager()`
- `public void setVillager(boolean villager)`
- `public void onLivingUpdate()`
- `public boolean attackEntityFrom( DamageSource source, float amount)`
- `public void onUpdate()`
- `public boolean attackEntityAsMob( Entity entityIn)`
- `protected java.lang.String getLivingSound()`
- `protected java.lang.String getHurtSound()`
- `protected java.lang.String getDeathSound()`
- `protected void playStepSound( BlockPos pos, Block blockIn)`
- `protected Item getDropItem()`
- `public EnumCreatureAttribute getCreatureAttribute()`
- `protected void addRandomDrop()`
- `protected void setEquipmentBasedOnDifficulty( DifficultyInstance difficulty)`
- `public void writeEntityToNBT( NBTTagCompound tagCompound)`
- `public void readEntityFromNBT( NBTTagCompound tagCompund)`
- `public void onKillEntity( EntityLivingBase entityLivingIn)`
- `public float getEyeHeight()`
- `protected boolean func_175448_a( ItemStack stack)`
- `public IEntityLivingData onInitialSpawn( DifficultyInstance difficulty, IEntityLivingData livingdata)`
- `public boolean interact( EntityPlayer player)`
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

## Description

The attribute which determines the chance that this mob will spawn reinforcements
