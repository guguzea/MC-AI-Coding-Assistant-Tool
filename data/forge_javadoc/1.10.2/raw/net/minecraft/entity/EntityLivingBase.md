---
title: "EntityLivingBase"
description: "public abstract class EntityLivingBase extends Entity"
package: "net/minecraft/entity"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/entity/EntityLivingBase.html"
sourceType: javadoc
---

# EntityLivingBase

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase

## Class signature

```java
public abstract class EntityLivingBase extends Entity
```

## Constructors

- `EntityLivingBase(World worldIn)`

## Methods

- `void addPotionEffect(PotionEffect potioneffectIn)`
- `protected float applyArmorCalculations(DamageSource source, float damage)`
- `protected void applyEntityAttributes()`
- `protected float applyPotionDamageCalculations(DamageSource source, float damage)`
- `static boolean areAllPotionsAmbient(java.util.Collection<PotionEffect> potionEffects)`
- `boolean attackEntityAsMob(Entity entityIn)`
- `boolean attackEntityFrom(DamageSource source, float amount)`
- `boolean attemptTeleport(double x, double y, double z)`
- `boolean canBeCollidedWith()`
- `boolean canBeHitWithPotion()`
- `boolean canBePushed()`
- `boolean canBreatheUnderwater()`
- `protected boolean canDropLoot()`
- `boolean canEntityBeSeen(Entity entityIn)`
- `void clearActivePotions()`
- `protected void collideWithEntity(Entity entityIn)`
- `protected void collideWithNearbyEntities()`
- `void curePotionEffects(ItemStack curativeItem)` — Removes all potion effects that have curativeItem as a curative item for its effect
- `protected void damageArmor(float damage)`
- `protected void damageEntity(DamageSource damageSrc, float damageAmount)`
- `protected void damageShield(float damage)`
- `protected int decreaseAirSupply(int air)`
- `void dismountEntity(Entity entityIn)`
- `void dismountRidingEntity()`
- `protected void dropEquipment(boolean wasRecentlyHit, int lootingModifier)`
- `protected void dropFewItems(boolean wasRecentlyHit, int lootingModifier)`
- `protected void dropLoot(boolean wasRecentlyHit, int lootingModifier, DamageSource source)`
- `protected void entityInit()`
- `void fall(float distance, float damageMultiplier)`
- `protected void frostWalk(BlockPos pos)`
- `float getAbsorptionAmount()`
- `EnumHand getActiveHand()`
- `ItemStack getActiveItemStack()`
- `PotionEffect getActivePotionEffect(Potion potionIn)`
- `java.util.Collection<PotionEffect> getActivePotionEffects()`
- `int getAge()`
- `float getAIMoveSpeed()`
- `EntityLivingBase getAITarget()`
- `boolean getAlwaysRenderNameTagForRender()`
- `abstract java.lang.Iterable<ItemStack> getArmorInventoryList()`
- `int getArrowCountInEntity()`
- `EntityLivingBase getAttackingEntity()`
- `AbstractAttributeMap getAttributeMap()`
- `<T> T getCapability(Capability<T> capability, EnumFacing facing)` — Retrieves the handler for the capability requested on the specific side.
- `CombatTracker getCombatTracker()`
- `EnumCreatureAttribute getCreatureAttribute()`
- `protected SoundEvent getDeathSound()`
- `IAttributeInstance getEntityAttribute(IAttribute attribute)`
- `protected int getExperiencePoints(EntityPlayer player)`
- `protected SoundEvent getFallSound(int heightIn)`
- `float getHealth()`
- `ItemStack getHeldItem(EnumHand hand)`
- `ItemStack getHeldItemMainhand()`
- `ItemStack getHeldItemOffhand()`
- `protected SoundEvent getHurtSound()`
- `int getItemInUseCount()`
- `int getItemInUseMaxCount()`
- `abstract ItemStack getItemStackFromSlot(EntityEquipmentSlot slotIn)`
- `protected float getJumpUpwardsMotion()`
- `EntityLivingBase getLastAttacker()`
- `int getLastAttackerTime()`
- `DamageSource getLastDamageSource()`
- `Vec3d getLook(float partialTicks)`
- `Vec3d getLookVec()`
- `float getMaxHealth()`
- `abstract EnumHandSide getPrimaryHand()`
- `int getRevengeTimer()`
- `java.util.Random getRNG()`
- `float getRotationYawHead()`
- `protected float getSoundPitch()`
- `protected float getSoundVolume()`
- `float getSwingProgress(float partialTickTime)`
- `int getTicksElytraFlying()`
- `int getTotalArmorValue()`
- `protected float getWaterSlowDown()`
- `protected void handleJumpLava()`
- `protected void handleJumpWater()`
- `void handleStatusUpdate(byte id)`
- `boolean hasCapability(Capability<?> capability, EnumFacing facing)` — Determines if this object has support for the capability in question on the specific side.
- `void heal(float healAmount)`
- `boolean isActiveItemStackBlocking()`
- `boolean isChild()`
- `boolean isElytraFlying()`
- `boolean isEntityAlive()`
- `boolean isEntityUndead()`
- `boolean isHandActive()`
- `protected boolean isMovementBlocked()`
- `boolean isOnLadder()`
- `protected boolean isPlayer()`
- `boolean isPlayerSleeping()`
- `boolean isPotionActive(Potion potionIn)`
- `boolean isPotionApplicable(PotionEffect potioneffectIn)`
- `boolean isServerWorld()`
- `protected void jump()`
- `protected void kill()`
- `void knockBack(Entity entityIn, float strenght, double xRatio, double zRatio)`
- `protected void markPotionsDirty()`
- `void moveEntityWithHeading(float strafe, float forward)`
- `void notifyDataManagerChange(DataParameter<?> key)`
- `protected void onChangedPotionEffect(PotionEffect id, boolean p_70695_2_)`
- `void onDeath(DamageSource cause)`
- `protected void onDeathUpdate()`
- `void onEntityUpdate()`
- `protected void onFinishedPotionEffect(PotionEffect effect)`
- `void onItemPickup(Entity entityIn, int quantity)`
- `protected void onItemUseFinish()`
- `void onKillCommand()`
- `void onLivingUpdate()`
- `protected void onNewPotionEffect(PotionEffect id)`
- `void onUpdate()`
- `void performHurtAnimation()`
- `protected void playEquipSound(ItemStack stack)`
- `protected void playHurtSound(DamageSource source)`
- `void readEntityFromNBT(NBTTagCompound compound)`
- `PotionEffect removeActivePotionEffect(Potion potioneffectin)`
- `void removePotionEffect(Potion potionIn)`
- `void renderBrokenItemStack(ItemStack stack)`
- `void resetActiveHand()`
- `protected void resetPotionEffectMetadata()`
- `void sendEndCombat()`
- `void sendEnterCombat()`
- `void setAbsorptionAmount(float amount)`
- `void setActiveHand(EnumHand hand)`
- `void setAIMoveSpeed(float speedIn)`
- `void setArrowCountInEntity(int count)`
- `protected void setBeenAttacked()`
- `void setHealth(float health)`
- `void setHeldItem(EnumHand hand, ItemStack stack)`
- `abstract void setItemStackToSlot(EntityEquipmentSlot slotIn, ItemStack stack)`
- `void setJumping(boolean jumping)`
- `void setLastAttacker(Entity entityIn)`
- `void setPositionAndRotationDirect(double x, double y, double z, float yaw, float pitch, int posRotationIncrements, boolean teleport)`
- `void setRenderYawOffset(float offset)`
- `void setRevengeTarget(EntityLivingBase livingBase)`
- `void setRotationYawHead(float rotation)`
- `void setSprinting(boolean sprinting)`
- `boolean shouldRiderFaceForward(EntityPlayer player)` — Returns true if the entity's rider (EntityPlayer) should face forward when mounted.
- `void stopActiveHand()`
- `void swingArm(EnumHand hand)`
- `protected void updateActiveHand()`
- `protected void updateArmSwingProgress()`
- `protected float updateDistance(float p_110146_1_, float p_110146_2_)`
- `protected void updateEntityActionState()`
- `protected void updateFallState(double y, boolean onGroundIn, IBlockState state, BlockPos pos)`
- `protected void updateItemUse(ItemStack stack, int eatingParticleCount)`
- `protected void updatePotionEffects()`
- `protected void updatePotionMetadata()`
- `void updateRidden()`
- `void writeEntityToNBT(NBTTagCompound compound)`

## Fields

- `protected ItemStack activeItemStack`
- `protected int activeItemStackUseCount`
- `int arrowHitTimer`
- `float attackedAtYaw`
- `protected EntityPlayer attackingPlayer`
- `float cameraPitch`
- `protected boolean dead`
- `int deathTime`
- `protected int entityAge`
- `protected static DataParameter<java.lang.Byte> HAND_STATES`
- `int hurtTime`
- `protected double interpTargetPitch`
- `protected double interpTargetX`
- `protected double interpTargetY`
- `protected double interpTargetYaw`
- `protected double interpTargetZ`
- `protected boolean isJumping`
- `boolean isSwingInProgress`
- `float jumpMovementFactor`
- `protected float lastDamage`
- `float limbSwing`
- `float limbSwingAmount`
- `int maxHurtResistantTime`
- `int maxHurtTime`
- `protected float movedDistance`
- `float moveForward`
- `float moveStrafing`
- `protected int newPosRotationIncrements`
- `protected float onGroundSpeedFactor`
- `float prevCameraPitch`
- `float prevLimbSwingAmount`
- `protected float prevMovedDistance`
- `protected float prevOnGroundSpeedFactor`
- `float prevRenderYawOffset`
- `float prevRotationYawHead`
- `float prevSwingProgress`
- `float randomUnused1`
- `float randomUnused2`
- `float randomYawVelocity`
- `protected int recentlyHit`
- `float renderYawOffset`
- `float rotationYawHead`
- `protected int scoreValue`
- `EnumHand swingingHand`
- `float swingProgress`
- `int swingProgressInt`
- `protected int ticksElytraFlying`
- `protected int ticksSinceLastSwing`
- `protected float unused180`
