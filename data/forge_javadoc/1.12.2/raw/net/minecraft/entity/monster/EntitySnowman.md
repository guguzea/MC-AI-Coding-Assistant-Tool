---
title: "EntitySnowman"
description: "public class EntitySnowman extends EntityGolem implements IRangedAttackMob, IShearable"
package: "net/minecraft/entity/monster"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/entity/monster/EntitySnowman.html"
sourceType: javadoc
---

# EntitySnowman

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.EntityLiving → net.minecraft.entity.EntityCreature → net.minecraft.entity.monster.EntityGolem → net.minecraft.entity.monster.EntitySnowman

## Class signature

```java
public class EntitySnowman extends EntityGolem implements IRangedAttackMob, IShearable
```

## Methods

- `protected void applyEntityAttributes()`
- `void attackEntityWithRangedAttack(EntityLivingBase target, float distanceFactor)`
- `protected void entityInit()`
- `protected SoundEvent getAmbientSound()`
- `protected SoundEvent getDeathSound()`
- `float getEyeHeight()`
- `protected SoundEvent getHurtSound(DamageSource damageSourceIn)`
- `protected ResourceLocation getLootTable()`
- `protected void initEntityAI()`
- `boolean isPumpkinEquipped()`
- `boolean isShearable(ItemStack item, IBlockAccess world, BlockPos pos)` — Checks if the object is currently shearable Example: Sheep return false when they have no wool
- `void onLivingUpdate()`
- `java.util.List<ItemStack> onSheared(ItemStack item, IBlockAccess world, BlockPos pos, int fortune)` — Performs the shear function on this object.
- `protected boolean processInteract(EntityPlayer player, EnumHand hand)`
- `void readEntityFromNBT(NBTTagCompound compound)`
- `static void registerFixesSnowman(DataFixer fixer)`
- `void setPumpkinEquipped(boolean pumpkinEquipped)`
- `void setSwingingArms(boolean swingingArms)`
- `void writeEntityToNBT(NBTTagCompound compound)`

## Fields

- `EntitySnowman`
