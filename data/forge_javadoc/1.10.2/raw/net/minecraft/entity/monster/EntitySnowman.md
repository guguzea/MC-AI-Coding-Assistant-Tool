---
title: "EntitySnowman"
description: "public class EntitySnowman extends EntityGolem implements IRangedAttackMob"
package: "net/minecraft/entity/monster"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/entity/monster/EntitySnowman.html"
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
- `public void onLivingUpdate()`
- `@Nullable protected ResourceLocation getLootTable()`
- `public void attackEntityWithRangedAttack( EntityLivingBase target, float distanceFactor)`
- `public float getEyeHeight()`
- `protected boolean processInteract( EntityPlayer player, EnumHand hand, @Nullable ItemStack stack)`
- `public boolean isPumpkinEquipped()`
- `public void setPumpkinEquipped(boolean pumpkinEquipped)`
- `@Nullable protected SoundEvent getAmbientSound()`
- `@Nullable protected SoundEvent getHurtSound()`
- `@Nullable protected SoundEvent getDeathSound()`
