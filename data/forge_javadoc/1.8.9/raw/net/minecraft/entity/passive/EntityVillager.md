---
title: "EntityVillager"
description: "Used by EntityAIVillagerInteract to check if the villager can give some items from an inventory to another villager."
package: "net/minecraft/entity/passive"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/passive/EntityVillager.html"
sourceType: javadoc
---

# EntityVillager

## Class signature

```java
public class EntityVillager extends EntityAgeable implements IMerchant , INpc
```

## Constructors

- `public EntityVillager( World worldIn)`
- `public EntityVillager( World worldIn, int professionId)`

## Methods

- `protected void onGrowingAdult()`
- `protected void applyEntityAttributes()`
- `protected void updateAITasks()`
- `public boolean interact( EntityPlayer player)`
- `protected void entityInit()`
- `public void writeEntityToNBT( NBTTagCompound tagCompound)`
- `public void readEntityFromNBT( NBTTagCompound tagCompund)`
- `protected boolean canDespawn()`
- `protected java.lang.String getLivingSound()`
- `protected java.lang.String getHurtSound()`
- `protected java.lang.String getDeathSound()`
- `public void setProfession(int professionId)`
- `public int getProfession()`
- `public boolean isMating()`
- `public void setMating(boolean mating)`
- `public void setPlaying(boolean playing)`
- `public boolean isPlaying()`
- `public void setRevengeTarget( EntityLivingBase livingBase)`
- `public void onDeath( DamageSource cause)`
- `public void setCustomer( EntityPlayer p_70932_1_)`
- `public EntityPlayer getCustomer()`
- `public boolean isTrading()`
- `public boolean getIsWillingToMate(boolean updateFirst)`
- `public void setIsWillingToMate(boolean willingToTrade)`
- `public void useRecipe( MerchantRecipe recipe)`
- `public void verifySellingItem( ItemStack stack)`
- `public MerchantRecipeList getRecipes( EntityPlayer p_70934_1_)`
- `public void setRecipes( MerchantRecipeList recipeList)`
- `public IChatComponent getDisplayName()`
- `public float getEyeHeight()`
- `public void handleStatusUpdate(byte id)`
- `public IEntityLivingData onInitialSpawn( DifficultyInstance difficulty, IEntityLivingData livingdata)`
- `public void setLookingForHome()`
- `public EntityVillager createChild( EntityAgeable ageable)`
- `public boolean allowLeashing()`
- `public void onStruckByLightning( EntityLightningBolt lightningBolt)`
- `public InventoryBasic getVillagerInventory()`
- `protected void updateEquipmentIfNeeded( EntityItem itemEntity)`
- `public boolean func_175553_cp()`
- `public boolean canAbondonItems()`
- `public boolean func_175557_cr()`
- `public boolean isFarmItemInInventory()`
- `public boolean replaceItemInInventory(int inventorySlot, ItemStack itemStackIn)`

## Description

Used by EntityAIVillagerInteract to check if the villager can give some items from an inventory to another villager.
