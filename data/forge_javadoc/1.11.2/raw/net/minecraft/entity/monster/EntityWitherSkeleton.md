---
title: "EntityWitherSkeleton"
description: "public class EntityWitherSkeleton extends AbstractSkeleton"
package: "net/minecraft/entity/monster"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/entity/monster/EntityWitherSkeleton.html"
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
- `@Nullable protected ResourceLocation getLootTable()`
- `protected SoundEvent getAmbientSound()`
- `protected SoundEvent getHurtSound()`
- `protected SoundEvent getDeathSound()`
- `public void onDeath( DamageSource cause)`
- `protected void setEquipmentBasedOnDifficulty( DifficultyInstance difficulty)`
- `protected void setEnchantmentBasedOnDifficulty( DifficultyInstance difficulty)`
- `@Nullable public IEntityLivingData onInitialSpawn( DifficultyInstance difficulty, @Nullable IEntityLivingData livingdata)`
- `public float getEyeHeight()`
- `public boolean attackEntityAsMob( Entity entityIn)`
- `protected EntityArrow getArrow(float p_190726_1_)`
