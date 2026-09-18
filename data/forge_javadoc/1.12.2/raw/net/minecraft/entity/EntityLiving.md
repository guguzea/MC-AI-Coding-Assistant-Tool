---
title: "EntityLiving"
description: "public abstract class EntityLiving extends EntityLivingBase"
package: "net/minecraft/entity"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/entity/EntityLiving.html"
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

- `protected void initEntityAI()`
- `protected void applyEntityAttributes()`
- `protected PathNavigate createNavigator( World worldIn)`
- `public float getPathPriority( PathNodeType nodeType)`
- `public void setPathPriority( PathNodeType nodeType, float priority)`
- `protected EntityBodyHelper createBodyHelper()`
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
- `protected void playHurtSound( DamageSource source)`
- `protected int getExperiencePoints( EntityPlayer player)`
- `public void spawnExplosionParticle()`
- `public void handleStatusUpdate(byte id)`
- `public void onUpdate()`
- `protected float updateDistance(float p_110146_1_, float p_110146_2_)`
- `protected SoundEvent getAmbientSound()`
- `protected Item getDropItem()`
- `protected void dropFewItems(boolean wasRecentlyHit, int lootingModifier)`
- `public static void registerFixesMob( DataFixer fixer, java.lang.Class<?> name)`
- `public void writeEntityToNBT( NBTTagCompound compound)`
- `public void readEntityFromNBT( NBTTagCompound compound)`
- `protected ResourceLocation getLootTable()`
- `protected void dropLoot(boolean wasRecentlyHit, int lootingModifier, DamageSource source)`
- `public void setMoveForward(float amount)`
- `public void setMoveVertical(float amount)`
- `public void setMoveStrafing(float amount)`
- `public void setAIMoveSpeed(float speedIn)`
- `public void onLivingUpdate()`
- `protected void updateEquipmentIfNeeded( EntityItem itemEntity)`
- `protected boolean canEquipItem( ItemStack stack)`
- `protected boolean canDespawn()`
- `protected void despawnEntity()`
- `protected final void updateEntityActionState()`
- `protected void updateAITasks()`
- `public int getVerticalFaceSpeed()`
- `public int getHorizontalFaceSpeed()`
- `public void faceEntity( Entity entityIn, float maxYawIncrease, float maxPitchIncrease)`
- `public boolean getCanSpawnHere()`
- `public boolean isNotColliding()`
- `public float getRenderSizeModifier()`
- `public int getMaxSpawnedInChunk()`
- `public int getMaxFallHeight()`
- `public java.lang.Iterable< ItemStack > getHeldEquipment()`
- `public java.lang.Iterable< ItemStack > getArmorInventoryList()`
- `public ItemStack getItemStackFromSlot( EntityEquipmentSlot slotIn)`
- `public void setItemStackToSlot( EntityEquipmentSlot slotIn, ItemStack stack)`
- `protected void dropEquipment(boolean wasRecentlyHit, int lootingModifier)`
- `protected void setEquipmentBasedOnDifficulty( DifficultyInstance difficulty)`
- `public static EntityEquipmentSlot getSlotForItemStack( ItemStack stack)`
- `public static Item getArmorByChance( EntityEquipmentSlot slotIn, int chance)`
- `protected void setEnchantmentBasedOnDifficulty( DifficultyInstance difficulty)`
- `public IEntityLivingData onInitialSpawn( DifficultyInstance difficulty, IEntityLivingData livingdata)`
- `public boolean canBeSteered()`
- `public void enablePersistence()`
- `public void setDropChance( EntityEquipmentSlot slotIn, float chance)`
- `public boolean canPickUpLoot()`
- `public void setCanPickUpLoot(boolean canPickup)`
- `public boolean isNoDespawnRequired()`
- `public final boolean processInitialInteract( EntityPlayer player, EnumHand hand)`
- `protected boolean processInteract( EntityPlayer player, EnumHand hand)`
- `protected void updateLeashedState()`
- `public void clearLeashed(boolean sendPacket, boolean dropLead)`
- `public boolean canBeLeashedTo( EntityPlayer player)`
- `public boolean getLeashed()`
- `public Entity getLeashHolder()`
- `public void setLeashHolder( Entity entityIn, boolean sendAttachNotification)`
- `public boolean startRiding( Entity entityIn, boolean force)`
- `public boolean replaceItemInInventory(int inventorySlot, ItemStack itemStackIn)`
- `public boolean canPassengerSteer()`
- `public static boolean isItemStackInSlot( EntityEquipmentSlot slotIn, ItemStack stack)`
- `public boolean isServerWorld()`
- `public void setNoAI(boolean disable)`
- `public void setLeftHanded(boolean leftHanded)`
- `public boolean isAIDisabled()`
- `public boolean isLeftHanded()`
- `public EnumHandSide getPrimaryHand()`
