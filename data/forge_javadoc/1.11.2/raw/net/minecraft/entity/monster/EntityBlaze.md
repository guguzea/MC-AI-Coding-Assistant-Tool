---
title: "EntityBlaze"
description: "public class EntityBlaze extends EntityMob"
package: "net/minecraft/entity/monster"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/entity/monster/EntityBlaze.html"
sourceType: javadoc
---

# EntityBlaze

## Class signature

```java
public class EntityBlaze extends EntityMob
```

## Constructors

- `public EntityBlaze( World worldIn)`

## Methods

- `public static void registerFixesBlaze( DataFixer fixer)`
- `protected void initEntityAI()`
- `protected void applyEntityAttributes()`
- `protected void entityInit()`
- `protected SoundEvent getAmbientSound()`
- `protected SoundEvent getHurtSound()`
- `protected SoundEvent getDeathSound()`
- `public int getBrightnessForRender(float partialTicks)`
- `public float getBrightness(float partialTicks)`
- `public void onLivingUpdate()`
- `protected void updateAITasks()`
- `public void fall(float distance, float damageMultiplier)`
- `public boolean isBurning()`
- `@Nullable protected ResourceLocation getLootTable()`
- `public boolean isCharged()`
- `public void setOnFire(boolean onFire)`
- `protected boolean isValidLightLevel()`
