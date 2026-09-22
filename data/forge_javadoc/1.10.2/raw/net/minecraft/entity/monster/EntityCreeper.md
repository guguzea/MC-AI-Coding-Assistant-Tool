---
title: "EntityCreeper"
description: "public class EntityCreeper extends EntityMob"
package: "net/minecraft/entity/monster"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/entity/monster/EntityCreeper.html"
sourceType: javadoc
---

# EntityCreeper

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.EntityLiving → net.minecraft.entity.EntityCreature → net.minecraft.entity.monster.EntityMob → net.minecraft.entity.monster.EntityCreeper

## Class signature

```java
public class EntityCreeper extends EntityMob
```

## Methods

- `protected void applyEntityAttributes()`
- `boolean attackEntityAsMob(Entity entityIn)`
- `protected void entityInit()`
- `void fall(float distance, float damageMultiplier)`
- `float getCreeperFlashIntensity(float p_70831_1_)`
- `int getCreeperState()`
- `protected SoundEvent getDeathSound()`
- `protected SoundEvent getHurtSound()`
- `protected ResourceLocation getLootTable()`
- `int getMaxFallHeight()`
- `boolean getPowered()`
- `boolean hasIgnited()`
- `void ignite()`
- `void incrementDroppedSkulls()`
- `protected void initEntityAI()`
- `boolean isAIEnabled()`
- `void onDeath(DamageSource cause)`
- `void onStruckByLightning(EntityLightningBolt lightningBolt)`
- `void onUpdate()`
- `protected boolean processInteract(EntityPlayer player, EnumHand hand, ItemStack stack)`
- `void readEntityFromNBT(NBTTagCompound compound)`
- `static void registerFixesCreeper(DataFixer fixer)`
- `void setCreeperState(int state)`
- `void writeEntityToNBT(NBTTagCompound compound)`

## Fields

- `EntityCreeper`
