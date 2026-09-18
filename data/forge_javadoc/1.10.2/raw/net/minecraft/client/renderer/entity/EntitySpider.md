---
title: "EntitySpider"
description: "public class EntitySpider extends EntityMob"
package: "net/minecraft/client/renderer/entity"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/entity/monster/EntitySpider.html"
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
- `protected PathNavigate getNewNavigator( World worldIn)`
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
