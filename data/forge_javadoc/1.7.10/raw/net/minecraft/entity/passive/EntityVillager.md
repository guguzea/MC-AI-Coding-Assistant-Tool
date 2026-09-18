---
title: "EntityVillager"
description: "public class EntityVillager extends EntityAgeable implements IMerchant , INpc"
package: "net/minecraft/entity/passive"
version: "1.7.10"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/net/minecraft/entity/passive/EntityVillager.html"
sourceType: javadoc
---

# EntityVillager

## Class signature

```java
public class EntityVillager extends EntityAgeable implements IMerchant , INpc
```

## Constructors

- `public EntityVillager( World p_i1747_1_)`
- `public EntityVillager( World p_i1748_1_, int p_i1748_2_)`

## Methods

- `protected void applyEntityAttributes()`
- `public boolean isAIEnabled()`
- `protected void updateAITick()`
- `public boolean interact( EntityPlayer p_70085_1_)`
- `protected void entityInit()`
- `public void writeEntityToNBT( NBTTagCompound p_70014_1_)`
- `public void readEntityFromNBT( NBTTagCompound p_70037_1_)`
- `protected boolean canDespawn()`
- `protected java.lang.String getLivingSound()`
- `protected java.lang.String getHurtSound()`
- `protected java.lang.String getDeathSound()`
- `public void setProfession(int p_70938_1_)`
- `public int getProfession()`
- `public boolean isMating()`
- `public void setMating(boolean p_70947_1_)`
- `public void setPlaying(boolean p_70939_1_)`
- `public boolean isPlaying()`
- `public void setRevengeTarget( EntityLivingBase p_70604_1_)`
- `public void onDeath( DamageSource p_70645_1_)`
- `public void setCustomer( EntityPlayer p_70932_1_)`
- `public EntityPlayer getCustomer()`
- `public boolean isTrading()`
- `public void useRecipe( MerchantRecipe p_70933_1_)`
- `public void func_110297_a_( ItemStack p_110297_1_)`
- `public MerchantRecipeList getRecipes( EntityPlayer p_70934_1_)`
- `public void setRecipes( MerchantRecipeList p_70930_1_)`
- `public static void func_146091_a( MerchantRecipeList p_146091_0_, Item p_146091_1_, java.util.Random p_146091_2_, float p_146091_3_)`
- `public static void func_146089_b( MerchantRecipeList p_146089_0_, Item p_146089_1_, java.util.Random p_146089_2_, float p_146089_3_)`
- `public void handleHealthUpdate(byte p_70103_1_)`
- `public IEntityLivingData onSpawnWithEgg( IEntityLivingData p_110161_1_)`
- `public void setLookingForHome()`
- `public EntityVillager createChild( EntityAgeable p_90011_1_)`
- `public boolean allowLeashing()`
