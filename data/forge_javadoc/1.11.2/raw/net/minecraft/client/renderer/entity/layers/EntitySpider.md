---
title: "EntitySpider"
description: "public class EntitySpider extends EntityMob"
package: "net/minecraft/client/renderer/entity/layers"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/entity/monster/EntitySpider.html"
sourceType: javadoc
---

# EntitySpider

## Class signature

```java
public class EntitySpider extends EntityMob
```

## Constructors

- `public EntitySpider( World worldIn)`

## Methods

- `public static void registerFixesSpider( DataFixer fixer)`
- `protected void initEntityAI()`
- `public double getMountedYOffset()`
- `protected PathNavigate createNavigator( World worldIn)`
- `protected void entityInit()`
- `public void onUpdate()`
- `protected void applyEntityAttributes()`
- `protected SoundEvent getAmbientSound()`
- `protected SoundEvent getHurtSound()`
- `protected SoundEvent getDeathSound()`
- `protected void playStepSound( BlockPos pos, Block blockIn)`
- `@Nullable protected ResourceLocation getLootTable()`
- `public boolean isOnLadder()`
- `public void setInWeb()`
- `public EnumCreatureAttribute getCreatureAttribute()`
- `public boolean isPotionApplicable( PotionEffect potioneffectIn)`
- `public boolean isBesideClimbableBlock()`
- `public void setBesideClimbableBlock(boolean climbing)`
- `@Nullable public IEntityLivingData onInitialSpawn( DifficultyInstance difficulty, @Nullable IEntityLivingData livingdata)`
- `public float getEyeHeight()`
