---
title: "EntityLivingBase"
description: "public abstract class EntityLivingBase extends Entity"
package: "net/minecraft/entity"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/EntityLivingBase.html"
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

- `void addPotionEffect(PotionEffect potioneffectIn)` — adds a PotionEffect to the entity
- `protected void addRandomDrop()` — Causes this Entity to drop a random item.
- `protected float applyArmorCalculations(DamageSource source, float damage)` — Reduces damage, depending on armor
- `protected void applyEntityAttributes()`
- `protected float applyPotionDamageCalculations(DamageSource source, float damage)` — Reduces damage, depending on potions
- `boolean attackEntityAsMob(Entity entityIn)`
- `boolean attackEntityFrom(DamageSource source, float amount)` — Called when the entity is attacked.
- `boolean canBeCollidedWith()` — Returns true if other Entities should be prevented from moving through this Entity.
- `boolean canBePushed()` — Returns true if this entity should push and be pushed by other entities when colliding.
- `boolean canBreatheUnderwater()`
- `protected boolean canDropLoot()` — Entity won't drop items or experience points if this returns false
- `boolean canEntityBeSeen(Entity entityIn)` — returns true if the entity provided in the argument can be seen.
- `void clearActivePotions()`
- `protected void collideWithEntity(Entity p_82167_1_)`
- `protected void collideWithNearbyEntities()`
- `void curePotionEffects(ItemStack curativeItem)` — Removes all potion effects that have curativeItem as a curative item for its effect
- `protected void damageArmor(float p_70675_1_)`
- `protected void damageEntity(DamageSource damageSrc, float damageAmount)` — Deals damage to the entity.
- `protected int decreaseAirSupply(int p_70682_1_)` — Decrements the entity's air supply when underwater
- `void dismountEntity(Entity p_110145_1_)` — Moves the entity to a position out of the way of its mount.
- `protected void dropEquipment(boolean p_82160_1_, int p_82160_2_)` — Drop the equipment for this entity.
- `protected void dropFewItems(boolean p_70628_1_, int p_70628_2_)` — Drop 0-2 items of this living's type
- `protected void entityInit()`
- `void fall(float distance, float damageMultiplier)`
- `protected float func_110146_f(float p_110146_1_, float p_110146_2_)`
- `void func_181013_g(float p_181013_1_)`
- `EntityLivingBase func_94060_bK()`
- `float getAbsorptionAmount()`
- `PotionEffect getActivePotionEffect(Potion potionIn)` — returns the PotionEffect for the supplied Potion if it is active, null otherwise.
- `java.util.Collection<PotionEffect> getActivePotionEffects()`
- `int getAge()`
- `float getAIMoveSpeed()` — the movespeed used for the new AI system
- `EntityLivingBase getAITarget()`
- `boolean getAlwaysRenderNameTagForRender()`
- `int getArrowCountInEntity()` — counts the amount of arrows stuck in the entity. getting hit by arrows increases this, used in rendering
- `BaseAttributeMap getAttributeMap()`
- `CombatTracker getCombatTracker()`
- `EnumCreatureAttribute getCreatureAttribute()` — Get this Entity's EnumCreatureAttribute
- `abstract ItemStack getCurrentArmor(int slotIn)`
- `protected java.lang.String getDeathSound()` — Returns the sound this mob makes on death.
- `IAttributeInstance getEntityAttribute(IAttribute attribute)`
- `abstract ItemStack getEquipmentInSlot(int slotIn)` — 0: Tool in Hand; 1-4: Armor
- `protected int getExperiencePoints(EntityPlayer player)` — Get the experience points the entity currently has.
- `protected java.lang.String getFallSoundString(int damageValue)`
- `float getHealth()`
- `abstract ItemStack getHeldItem()` — Returns the item that this EntityLiving is holding, if any.
- `protected java.lang.String getHurtSound()` — Returns the sound this mob makes when it is hurt.
- `abstract ItemStack [] getInventory()` — returns the inventory of this entity (only used in EntityPlayerMP it seems)
- `protected float getJumpUpwardsMotion()`
- `EntityLivingBase getLastAttacker()`
- `int getLastAttackerTime()`
- `Vec3 getLook(float partialTicks)` — interpolated look vector
- `Vec3 getLookVec()` — returns a (normalized) vector of where this entity is looking
- `float getMaxHealth()`
- `int getRevengeTimer()`
- `java.util.Random getRNG()`
- `float getRotationYawHead()`
- `protected float getSoundPitch()` — Gets the pitch of living sounds in living entities.
- `protected float getSoundVolume()` — Returns the volume for the sounds this mob makes.
- `float getSwingProgress(float partialTickTime)` — Returns where in the swing animation the living entity is (from 0 to 1).
- `Team getTeam()`
- `int getTotalArmorValue()` — Returns the current armor value as determined by a call to InventoryPlayer.getTotalArmorValue
- `protected void handleJumpLava()`
- `void handleStatusUpdate(byte id)`
- `void heal(float healAmount)` — Heal living entity (param: amount of half-hearts)
- `boolean isChild()` — If Animal, checks if the age timer is negative
- `boolean isEntityAlive()` — Checks whether target entity is alive.
- `boolean isEntityUndead()` — Returns true if this entity is undead.
- `protected boolean isMovementBlocked()` — Dead and sleeping entities cannot move
- `boolean isOnLadder()` — returns true if this entity is by a ladder, false otherwise
- `boolean isOnSameTeam(EntityLivingBase otherEntity)`
- `boolean isOnTeam(Team p_142012_1_)` — Returns true if the entity is on a specific team.
- `protected boolean isPlayer()` — Only use is to identify if class is an instance of player for experience dropping
- `boolean isPlayerSleeping()` — Returns whether player is sleeping or not
- `boolean isPotionActive(int potionId)`
- `boolean isPotionActive(Potion potionIn)`
- `boolean isPotionApplicable(PotionEffect potioneffectIn)`
- `boolean isServerWorld()` — Returns whether the entity is in a server world
- `protected void jump()` — Causes this entity to do an upwards motion (jumping).
- `protected void kill()` — sets the dead flag.
- `void knockBack(Entity entityIn, float p_70653_2_, double p_70653_3_, double p_70653_5_)` — knocks back this entity
- `protected void markPotionsDirty()`
- `void mountEntity(Entity entityIn)` — Called when a player mounts an entity. e.g. mounts a pig, mounts a boat.
- `void moveEntityWithHeading(float strafe, float forward)` — Moves the entity based on the specified heading.
- `protected void onChangedPotionEffect(PotionEffect id, boolean p_70695_2_)`
- `void onDeath(DamageSource cause)` — Called when the mob's health reaches 0.
- `protected void onDeathUpdate()` — handles entity death timer, experience orb and particle creation
- `void onEntityUpdate()` — Gets called every tick from main Entity class
- `protected void onFinishedPotionEffect(PotionEffect p_70688_1_)`
- `void onItemPickup(Entity p_71001_1_, int p_71001_2_)` — Called whenever an item is picked up from walking over it.
- `void onKillCommand()` — Called by the /kill command.
- `void onLivingUpdate()` — Called frequently so the entity can update its state every tick as required.
- `protected void onNewPotionEffect(PotionEffect id)`
- `void onUpdate()` — Called to update the entity's position/logic.
- `void performHurtAnimation()` — Setups the entity to do the hurt animation.
- `void readEntityFromNBT(NBTTagCompound tagCompund)` — (abstract) Protected helper method to read subclass entity data from NBT.
- `void removePotionEffect(int potionId)` — Remove the specified potion effect from this entity.
- `void removePotionEffectClient(int potionId)` — Remove the speified potion effect from this entity.
- `void renderBrokenItemStack(ItemStack stack)` — Renders broken item particles using the given ItemStack
- `protected void resetPotionEffectMetadata()` — Resets the potion effect color and ambience metadata values
- `void sendEndCombat()` — Sends an END_COMBAT packet to the client
- `void sendEnterCombat()` — Sends an ENTER_COMBAT packet to the client
- `void setAbsorptionAmount(float amount)`
- `void setAIMoveSpeed(float speedIn)` — set the movespeed used for the new AI system
- `void setArrowCountInEntity(int count)` — sets the amount of arrows stuck in the entity. used for rendering those
- `protected void setBeenAttacked()` — Sets that this entity has been attacked.
- `abstract void setCurrentItemOrArmor(int slotIn, ItemStack stack)` — Sets the held item, or an armor slot.
- `void setHealth(float health)`
- `void setJumping(boolean p_70637_1_)`
- `void setLastAttacker(Entity entityIn)`
- `void setPositionAndRotation2(double x, double y, double z, float yaw, float pitch, int posRotationIncrements, boolean p_180426_10_)`
- `void setRevengeTarget(EntityLivingBase livingBase)`
- `void setRotationYawHead(float rotation)` — Sets the head's yaw rotation of the entity.
- `void setSprinting(boolean sprinting)` — Set sprinting switch for Entity.
- `boolean shouldRiderFaceForward(EntityPlayer player)` — Returns true if the entity's rider (EntityPlayer) should face forward when mounted.
- `void swingItem()` — Swings the item the player is holding.
- `protected void updateAITick()` — main AI tick function, replaces updateEntityActionState
- `protected void updateArmSwingProgress()` — Updates the arm swing progress counters and animation progress
- `protected void updateEntityActionState()`
- `protected void updateFallState(double y, boolean onGroundIn, Block blockIn, BlockPos pos)`
- `protected void updatePotionEffects()`
- `protected void updatePotionMetadata()` — Clears potion metadata values if the entity has no potion effects.
- `void updateRidden()` — Handles updating while being ridden by an entity
- `void writeEntityToNBT(NBTTagCompound tagCompound)` — (abstract) Protected helper method to write subclass entity data to NBT.

## Fields

- `int arrowHitTimer`
- `float attackedAtYaw` — The yaw at which this entity was last attacked from.
- `protected EntityPlayer attackingPlayer` — The most recent player that has attacked this entity
- `float cameraPitch`
- `protected boolean dead` — This gets set on entity death, but never used.
- `int deathTime` — The amount of time remaining this entity should act 'dead', i.e. have a corpse in the world.
- `protected int entityAge` — The age of this EntityLiving (used to determine when it dies)
- `protected float field_70741_aB`
- `float field_70769_ao`
- `float field_70770_ap`
- `int hurtTime` — The amount of time remaining this entity should act 'hurt'.
- `protected boolean isJumping` — used to check whether entity is jumping.
- `boolean isSwingInProgress` — Whether an arm swing is currently in progress.
- `float jumpMovementFactor` — A factor used to determine how far this entity will move each tick if it is jumping or falling.
- `protected float lastDamage` — Damage taken in the last hit.
- `float limbSwing` — Only relevant when limbYaw is not 0(the entity is moving).
- `float limbSwingAmount`
- `int maxHurtResistantTime`
- `int maxHurtTime` — What the hurt time was max set to last.
- `protected float movedDistance`
- `float moveForward`
- `float moveStrafing`
- `protected int newPosRotationIncrements` — The number of updates over which the new position and rotation are to be applied to the entity.
- `protected double newPosX` — The new X position to be applied to the entity.
- `protected double newPosY` — The new Y position to be applied to the entity.
- `protected double newPosZ`
- `protected double newRotationPitch` — The new yaw rotation to be applied to the entity.
- `protected double newRotationYaw` — The new yaw rotation to be applied to the entity.
- `protected float onGroundSpeedFactor`
- `float prevCameraPitch`
- `float prevLimbSwingAmount`
- `protected float prevMovedDistance`
- `protected float prevOnGroundSpeedFactor`
- `float prevRenderYawOffset`
- `float prevRotationYawHead` — Entity head rotation yaw at previous tick
- `float prevSwingProgress`
- `protected float randomYawVelocity`
- `protected int recentlyHit` — Set to 60 when hit by the player or the player's wolf, then decrements.
- `float renderYawOffset`
- `float rotationYawHead` — Entity head rotation yaw
- `protected int scoreValue` — The score value of the Mob, the amount of points the mob is worth.
- `float swingProgress`
- `int swingProgressInt`
