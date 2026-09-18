---
title: "EntityWitherSkeleton"
description: "public class EntityWitherSkeleton extends AbstractSkeleton"
package: "net/minecraft/entity/monster"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/entity/monster/EntityWitherSkeleton.html"
sourceType: javadoc
---

# EntityWitherSkeleton

## Class signature

```java
public class EntityWitherSkeleton extends AbstractSkeleton
```

## Constructors

- `public EntityWitherSkeleton( World worldIn)`

## Methods

- `public static void registerFixesWitherSkeleton( DataFixer fixer)`
- `protected ResourceLocation getLootTable()`
- `protected SoundEvent getAmbientSound()`
- `protected SoundEvent getHurtSound( DamageSource damageSourceIn)`
- `protected SoundEvent getDeathSound()`
- `protected SoundEvent getStepSound()`
- `public void onDeath( DamageSource cause)`
- `protected void setEquipmentBasedOnDifficulty( DifficultyInstance difficulty)`
- `protected void setEnchantmentBasedOnDifficulty( DifficultyInstance difficulty)`
- `public IEntityLivingData onInitialSpawn( DifficultyInstance difficulty, IEntityLivingData livingdata)`
- `public float getEyeHeight()`
- `public boolean attackEntityAsMob( Entity entityIn)`
- `protected EntityArrow getArrow(float p_190726_1_)`
