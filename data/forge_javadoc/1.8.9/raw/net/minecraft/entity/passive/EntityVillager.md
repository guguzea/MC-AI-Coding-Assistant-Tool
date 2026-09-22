---
title: "EntityVillager"
description: "public class EntityVillager extends EntityAgeable implements IMerchant, INpc"
package: "net/minecraft/entity/passive"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/passive/EntityVillager.html"
sourceType: javadoc
---

# EntityVillager

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.EntityLiving → net.minecraft.entity.EntityCreature → net.minecraft.entity.EntityAgeable → net.minecraft.entity.passive.EntityVillager

## Class signature

```java
public class EntityVillager extends EntityAgeable implements IMerchant, INpc
```

## Methods

- `boolean allowLeashing()`
- `protected void applyEntityAttributes()`
- `boolean canAbondonItems()` — Used by EntityAIVillagerInteract to check if the villager can give some items from an inventory to another villager.
- `protected boolean canDespawn()` — Determines if an entity can be despawned, used on idle far away entities
- `EntityVillager createChild(EntityAgeable ageable)`
- `protected void entityInit()`
- `boolean func_175553_cp()`
- `boolean func_175557_cr()`
- `EntityPlayer getCustomer()`
- `protected java.lang.String getDeathSound()` — Returns the sound this mob makes on death.
- `IChatComponent getDisplayName()` — Get the formatted ChatComponent that will be used for the sender's username in chat
- `float getEyeHeight()`
- `protected java.lang.String getHurtSound()` — Returns the sound this mob makes when it is hurt.
- `boolean getIsWillingToMate(boolean updateFirst)` — Returns current or updated value of isWillingToMate
- `protected java.lang.String getLivingSound()` — Returns the sound this mob makes while it's alive.
- `int getProfession()`
- `MerchantRecipeList getRecipes(EntityPlayer p_70934_1_)`
- `InventoryBasic getVillagerInventory()`
- `void handleStatusUpdate(byte id)`
- `boolean interact(EntityPlayer player)` — Called when a player interacts with a mob. e.g. gets milk from a cow, gets into the saddle on a pig.
- `boolean isFarmItemInInventory()` — Returns true if villager has seeds, potatoes or carrots in inventory
- `boolean isMating()`
- `boolean isPlaying()`
- `boolean isTrading()`
- `void onDeath(DamageSource cause)` — Called when the mob's health reaches 0.
- `protected void onGrowingAdult()` — This is called when Entity's growing age timer reaches 0 (negative values are considered as a child, positive as an adult)
- `IEntityLivingData onInitialSpawn(DifficultyInstance difficulty, IEntityLivingData livingdata)` — Called only once on an entity when first time spawned, via egg, mob spawner, natural spawning etc, but not called when entity is reloaded from nbt.
- `void onStruckByLightning(EntityLightningBolt lightningBolt)` — Called when a lightning bolt hits the entity.
- `void readEntityFromNBT(NBTTagCompound tagCompund)` — (abstract) Protected helper method to read subclass entity data from NBT.
- `boolean replaceItemInInventory(int inventorySlot, ItemStack itemStackIn)`
- `void setCustomer(EntityPlayer p_70932_1_)`
- `void setIsWillingToMate(boolean willingToTrade)`
- `void setLookingForHome()`
- `void setMating(boolean mating)`
- `void setPlaying(boolean playing)`
- `void setProfession(int professionId)`
- `void setRecipes(MerchantRecipeList recipeList)`
- `void setRevengeTarget(EntityLivingBase livingBase)`
- `protected void updateAITasks()`
- `protected void updateEquipmentIfNeeded(EntityItem itemEntity)` — Tests if this entity should pickup a weapon or an armor.
- `void useRecipe(MerchantRecipe recipe)`
- `void verifySellingItem(ItemStack stack)` — Notifies the merchant of a possible merchantrecipe being fulfilled or not.
- `void writeEntityToNBT(NBTTagCompound tagCompound)` — (abstract) Protected helper method to write subclass entity data to NBT.

## Fields

- `EntityVillager`
- `EntityVillager`
