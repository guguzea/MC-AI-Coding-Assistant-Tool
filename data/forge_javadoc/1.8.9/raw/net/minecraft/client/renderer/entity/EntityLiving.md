---
title: "EntityLiving"
description: "Chances for each equipment piece from dropping when this entity dies."
package: "net/minecraft/client/renderer/entity"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/EntityLiving.html"
sourceType: javadoc
---

# EntityLiving

## Class signature

```java
public abstract class EntityLiving extends EntityLivingBase
```

## Constructors

- `public EntityLiving( World worldIn)`

## Methods

- `protected void applyEntityAttributes()`
- `protected PathNavigate getNewNavigator( World worldIn)`
- `public EntityLookHelper getLookHelper()`
- `public EntityMoveHelper getMoveHelper()`
- `public EntityJumpHelper getJumpHelper()`
- `public PathNavigate getNavigator()`
- `public EntitySenses getEntitySenses()`
- `public EntityLivingBase getAttackTarget()`
- `public void setAttackTarget( EntityLivingBase entitylivingbaseIn)`
- `public boolean canAttackClass(java.lang.Class<? extends EntityLivingBase > cls)`
- `public void eatGrassBonus()`
- `protected void entityInit()`
- `public int getTalkInterval()`
- `public void playLivingSound()`
- `public void onEntityUpdate()`
- `protected int getExperiencePoints( EntityPlayer player)`
- `public void spawnExplosionParticle()`
- `public void handleStatusUpdate(byte id)`
- `public void onUpdate()`
- `protected float func_110146_f(float p_110146_1_, float p_110146_2_)`
- `protected java.lang.String getLivingSound()`
- `protected Item getDropItem()`
- `protected void dropFewItems(boolean p_70628_1_, int p_70628_2_)`
- `public void writeEntityToNBT( NBTTagCompound tagCompound)`
- `public void readEntityFromNBT( NBTTagCompound tagCompund)`
- `public void setMoveForward(float p_70657_1_)`
- `public void setAIMoveSpeed(float speedIn)`
- `public void onLivingUpdate()`
- `protected void updateEquipmentIfNeeded( EntityItem itemEntity)`
- `protected boolean func_175448_a( ItemStack stack)`
- `protected boolean canDespawn()`
- `protected void despawnEntity()`
- `protected final void updateEntityActionState()`
- `protected void updateAITasks()`
- `public int getVerticalFaceSpeed()`
- `public void faceEntity( Entity entityIn, float p_70625_2_, float p_70625_3_)`
- `public boolean getCanSpawnHere()`
- `public boolean isNotColliding()`
- `public float getRenderSizeModifier()`
- `public int getMaxSpawnedInChunk()`
- `public int getMaxFallHeight()`
- `public ItemStack getHeldItem()`
- `public ItemStack getEquipmentInSlot(int slotIn)`
- `public ItemStack getCurrentArmor(int slotIn)`
- `public void setCurrentItemOrArmor(int slotIn, ItemStack stack)`
- `public ItemStack [] getInventory()`
- `protected void dropEquipment(boolean p_82160_1_, int p_82160_2_)`
- `protected void setEquipmentBasedOnDifficulty( DifficultyInstance difficulty)`
- `public static int getArmorPosition( ItemStack stack)`
- `public static Item getArmorItemForSlot(int armorSlot, int itemTier)`
- `protected void setEnchantmentBasedOnDifficulty( DifficultyInstance difficulty)`
- `public IEntityLivingData onInitialSpawn( DifficultyInstance difficulty, IEntityLivingData livingdata)`
- `public boolean canBeSteered()`
- `public void enablePersistence()`
- `public void setEquipmentDropChance(int slotIn, float chance)`
- `public boolean canPickUpLoot()`
- `public void setCanPickUpLoot(boolean canPickup)`
- `public boolean isNoDespawnRequired()`
- `public final boolean interactFirst( EntityPlayer playerIn)`
- `protected boolean interact( EntityPlayer player)`
- `protected void updateLeashedState()`
- `public void clearLeashed(boolean sendPacket, boolean dropLead)`
- `public boolean allowLeashing()`
- `public boolean getLeashed()`
- `public Entity getLeashedToEntity()`
- `public void setLeashedToEntity( Entity entityIn, boolean sendAttachNotification)`
- `public boolean replaceItemInInventory(int inventorySlot, ItemStack itemStackIn)`
- `public boolean isServerWorld()`
- `public void setNoAI(boolean disable)`
- `public boolean isAIDisabled()`

## Description

Chances for each equipment piece from dropping when this entity dies.
