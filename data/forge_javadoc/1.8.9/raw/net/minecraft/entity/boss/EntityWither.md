---
title: "EntityWither"
description: "adds a PotionEffect to the entity"
package: "net/minecraft/entity/boss"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/boss/EntityWither.html"
sourceType: javadoc
---

# EntityWither

## Class signature

```java
public class EntityWither extends EntityMob implements IBossDisplayData , IRangedAttackMob
```

## Constructors

- `public EntityWither( World worldIn)`

## Methods

- `protected void entityInit()`
- `public void writeEntityToNBT( NBTTagCompound tagCompound)`
- `public void readEntityFromNBT( NBTTagCompound tagCompund)`
- `protected java.lang.String getLivingSound()`
- `protected java.lang.String getHurtSound()`
- `protected java.lang.String getDeathSound()`
- `public void onLivingUpdate()`
- `protected void updateAITasks()`
- `public static boolean func_181033_a( Block p_181033_0_)`
- `public void func_82206_m()`
- `public void setInWeb()`
- `public int getTotalArmorValue()`
- `public void attackEntityWithRangedAttack( EntityLivingBase p_82196_1_, float p_82196_2_)`
- `public boolean attackEntityFrom( DamageSource source, float amount)`
- `protected void dropFewItems(boolean p_70628_1_, int p_70628_2_)`
- `protected void despawnEntity()`
- `public int getBrightnessForRender(float partialTicks)`
- `public void fall(float distance, float damageMultiplier)`
- `public void addPotionEffect( PotionEffect potioneffectIn)`
- `protected void applyEntityAttributes()`
- `public float func_82207_a(int p_82207_1_)`
- `public float func_82210_r(int p_82210_1_)`
- `public int getInvulTime()`
- `public void setInvulTime(int p_82215_1_)`
- `public int getWatchedTargetId(int p_82203_1_)`
- `public void updateWatchedTargetId(int targetOffset, int newId)`
- `public boolean isArmored()`
- `public EnumCreatureAttribute getCreatureAttribute()`
- `public void mountEntity( Entity entityIn)`

## Description

adds a PotionEffect to the entity
