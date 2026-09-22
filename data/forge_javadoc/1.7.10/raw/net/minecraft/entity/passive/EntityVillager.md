---
title: "EntityVillager"
description: "public class EntityVillager extends EntityAgeable implements IMerchant, INpc"
package: "net/minecraft/entity/passive"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/net/minecraft/entity/passive/EntityVillager.html"
sourceType: javadoc
---

# EntityVillager

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.EntityLiving → net.minecraft.entity.EntityCreature → net.minecraft.entity.EntityAgeable → net.minecraft.entity.passive.EntityVillager

## Class signature

```java
public class EntityVillager extends EntityAgeable implements IMerchant, INpc
```

## Constructors

- `EntityVillager(World p_i1747_1_)`
- `EntityVillager(World p_i1748_1_, int p_i1748_2_)`

## Methods

- `boolean allowLeashing()`
- `protected void applyEntityAttributes()`
- `protected boolean canDespawn()`
- `EntityVillager createChild(EntityAgeable p_90011_1_)`
- `protected void entityInit()`
- `void func_110297_a_(ItemStack p_110297_1_)`
- `static void func_146089_b(MerchantRecipeList p_146089_0_, Item p_146089_1_, java.util.Random p_146089_2_, float p_146089_3_)`
- `static void func_146091_a(MerchantRecipeList p_146091_0_, Item p_146091_1_, java.util.Random p_146091_2_, float p_146091_3_)`
- `EntityPlayer getCustomer()`
- `protected java.lang.String getDeathSound()`
- `protected java.lang.String getHurtSound()`
- `protected java.lang.String getLivingSound()`
- `int getProfession()`
- `MerchantRecipeList getRecipes(EntityPlayer p_70934_1_)`
- `void handleHealthUpdate(byte p_70103_1_)`
- `boolean interact(EntityPlayer p_70085_1_)`
- `boolean isAIEnabled()`
- `boolean isMating()`
- `boolean isPlaying()`
- `boolean isTrading()`
- `void onDeath(DamageSource p_70645_1_)`
- `IEntityLivingData onSpawnWithEgg(IEntityLivingData p_110161_1_)`
- `void readEntityFromNBT(NBTTagCompound p_70037_1_)`
- `void setCustomer(EntityPlayer p_70932_1_)`
- `void setLookingForHome()`
- `void setMating(boolean p_70947_1_)`
- `void setPlaying(boolean p_70939_1_)`
- `void setProfession(int p_70938_1_)`
- `void setRecipes(MerchantRecipeList p_70930_1_)`
- `void setRevengeTarget(EntityLivingBase p_70604_1_)`
- `protected void updateAITick()`
- `void useRecipe(MerchantRecipe p_70933_1_)`
- `void writeEntityToNBT(NBTTagCompound p_70014_1_)`

## Fields

- `static java.util.Map blacksmithSellingList`
- `static java.util.Map villagersSellingList`
