---
title: "EntityCreeper"
description: "public class EntityCreeper extends EntityMob"
package: "net/minecraft/entity/monster"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/entity/monster/EntityCreeper.html"
sourceType: javadoc
---

# EntityCreeper

## Class signature

```java
public class EntityCreeper extends EntityMob
```

## Constructors

- `public EntityCreeper( World worldIn)`

## Methods

- `protected void initEntityAI()`
- `protected void applyEntityAttributes()`
- `public int getMaxFallHeight()`
- `public void fall(float distance, float damageMultiplier)`
- `protected void entityInit()`
- `public static void registerFixesCreeper( DataFixer fixer)`
- `public void writeEntityToNBT( NBTTagCompound compound)`
- `public void readEntityFromNBT( NBTTagCompound compound)`
- `public void onUpdate()`
- `protected SoundEvent getHurtSound()`
- `protected SoundEvent getDeathSound()`
- `public void onDeath( DamageSource cause)`
- `public boolean attackEntityAsMob( Entity entityIn)`
- `public boolean getPowered()`
- `public float getCreeperFlashIntensity(float p_70831_1_)`
- `@Nullable protected ResourceLocation getLootTable()`
- `public int getCreeperState()`
- `public void setCreeperState(int state)`
- `public void onStruckByLightning( EntityLightningBolt lightningBolt)`
- `protected boolean processInteract( EntityPlayer player, EnumHand hand)`
- `public boolean hasIgnited()`
- `public void ignite()`
- `public boolean isAIEnabled()`
- `public void incrementDroppedSkulls()`
