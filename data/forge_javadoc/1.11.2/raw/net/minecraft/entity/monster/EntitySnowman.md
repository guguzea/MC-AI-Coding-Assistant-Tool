---
title: "EntitySnowman"
description: "public class EntitySnowman extends EntityGolem implements IRangedAttackMob"
package: "net/minecraft/entity/monster"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/entity/monster/EntitySnowman.html"
sourceType: javadoc
---

# EntitySnowman

## Class signature

```java
public class EntitySnowman extends EntityGolem implements IRangedAttackMob
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
- `@Nullable protected ResourceLocation getLootTable()`
- `public void attackEntityWithRangedAttack( EntityLivingBase target, float distanceFactor)`
- `public float getEyeHeight()`
- `protected boolean processInteract( EntityPlayer player, EnumHand hand)`
- `public boolean isPumpkinEquipped()`
- `public void setPumpkinEquipped(boolean pumpkinEquipped)`
- `@Nullable protected SoundEvent getAmbientSound()`
- `@Nullable protected SoundEvent getHurtSound()`
- `@Nullable protected SoundEvent getDeathSound()`
