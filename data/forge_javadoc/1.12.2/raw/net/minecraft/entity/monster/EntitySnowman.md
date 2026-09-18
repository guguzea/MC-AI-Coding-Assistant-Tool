---
title: "EntitySnowman"
description: "Checks if the object is currently shearable Example: Sheep return false when they have no wool"
package: "net/minecraft/entity/monster"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/entity/monster/EntitySnowman.html"
sourceType: javadoc
---

# EntitySnowman

## Class signature

```java
public class EntitySnowman extends EntityGolem implements IRangedAttackMob , IShearable
```

## Constructors

- `public EntitySnowman( World worldIn)`

## Methods

- `public static void registerFixesSnowman( DataFixer fixer)`
- `protected void initEntityAI()`
- `protected void applyEntityAttributes()`
- `protected void entityInit()`
- `public void writeEntityToNBT( NBTTagCompound compound)`
- `public void readEntityFromNBT( NBTTagCompound compound)`
- `public void onLivingUpdate()`
- `protected ResourceLocation getLootTable()`
- `public void attackEntityWithRangedAttack( EntityLivingBase target, float distanceFactor)`
- `public float getEyeHeight()`
- `protected boolean processInteract( EntityPlayer player, EnumHand hand)`
- `public boolean isPumpkinEquipped()`
- `public void setPumpkinEquipped(boolean pumpkinEquipped)`
- `protected SoundEvent getAmbientSound()`
- `protected SoundEvent getHurtSound( DamageSource damageSourceIn)`
- `protected SoundEvent getDeathSound()`
- `public boolean isShearable( ItemStack item, IBlockAccess world, BlockPos pos)`
- `public java.util.List< ItemStack > onSheared( ItemStack item, IBlockAccess world, BlockPos pos, int fortune)`
- `public void setSwingingArms(boolean swingingArms)`

## Description

Checks if the object is currently shearable Example: Sheep return false when they have no wool
