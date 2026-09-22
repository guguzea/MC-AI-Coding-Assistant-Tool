---
title: "Entity"
description: "public abstract class Entity extends java.lang.Object"
package: "net/minecraft/entity"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/net/minecraft/entity/Entity.html"
sourceType: javadoc
---

# Entity

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity

## Class signature

```java
public abstract class Entity extends java.lang.Object
```

## Constructors

- `Entity(World p_i1582_1_)`

## Methods

- `void addEntityCrashInfo(CrashReportCategory p_85029_1_)`
- `void addToPlayerScore(Entity p_70084_1_, int p_70084_2_)`
- `void addVelocity(double p_70024_1_, double p_70024_3_, double p_70024_5_)`
- `void applyEntityCollision(Entity p_70108_1_)`
- `boolean attackEntityFrom(DamageSource p_70097_1_, float p_70097_2_)`
- `boolean canAttackWithItem()`
- `boolean canBeCollidedWith()`
- `boolean canBePushed()`
- `boolean canRenderOnFire()`
- `protected boolean canTriggerWalking()`
- `void copyDataFrom(Entity p_82141_1_, boolean p_82141_2_)`
- `void copyLocationAndAnglesFrom(Entity p_82149_1_)`
- `protected void dealFireDamage(int p_70081_1_)`
- `boolean doesEntityNotTriggerPressurePlate()`
- `EntityItem dropItem(Item p_145779_1_, int p_145779_2_)`
- `EntityItem entityDropItem(ItemStack p_70099_1_, float p_70099_2_)`
- `protected abstract void entityInit()`
- `boolean equals(java.lang.Object p_equals_1_)`
- `void extinguish()`
- `protected void fall(float p_70069_1_)`
- `IChatComponent func_145748_c_()`
- `protected boolean func_145771_j(double p_145771_1_, double p_145771_3_, double p_145771_5_)`
- `float func_145772_a(Explosion p_145772_1_, World p_145772_2_, int p_145772_3_, int p_145772_4_, int p_145772_5_, Block p_145772_6_)`
- `boolean func_145774_a(Explosion p_145774_1_, World p_145774_2_, int p_145774_3_, int p_145774_4_, int p_145774_5_, Block p_145774_6_, float p_145774_7_)`
- `protected void func_145775_I()`
- `EntityItem func_145778_a(Item p_145778_1_, int p_145778_2_, float p_145778_3_)`
- `protected void func_145780_a(int p_145780_1_, int p_145780_2_, int p_145780_3_, Block p_145780_4_)`
- `void func_145781_i(int p_145781_1_)`
- `int getAir()`
- `AxisAlignedBB getBoundingBox()`
- `float getBrightness(float p_70013_1_)`
- `int getBrightnessForRender(float p_70070_1_)`
- `float getCollisionBorderSize()`
- `AxisAlignedBB getCollisionBox(Entity p_70114_1_)`
- `java.lang.String getCommandSenderName()`
- `DataWatcher getDataWatcher()`
- `double getDistance(double p_70011_1_, double p_70011_3_, double p_70011_5_)`
- `double getDistanceSq(double p_70092_1_, double p_70092_3_, double p_70092_5_)`
- `double getDistanceSqToEntity(Entity p_70068_1_)`
- `float getDistanceToEntity(Entity p_70032_1_)`
- `int getEntityId()`
- `protected java.lang.String getEntityString()`
- `float getEyeHeight()`
- `protected boolean getFlag(int p_70083_1_)`
- `ItemStack [] getLastActiveItems()`
- `Vec3 getLookVec()`
- `int getMaxInPortalTime()`
- `int getMaxSafePointTries()`
- `double getMountedYOffset()`
- `Entity [] getParts()`
- `int getPortalCooldown()`
- `float getRotationYawHead()`
- `float getShadowSize()`
- `protected java.lang.String getSplashSound()`
- `protected java.lang.String getSwimSound()`
- `int getTeleportDirection()`
- `java.util.UUID getUniqueID()`
- `double getYOffset()`
- `void handleHealthUpdate(byte p_70103_1_)`
- `boolean handleLavaMovement()`
- `boolean handleWaterMovement()`
- `int hashCode()`
- `boolean hitByEntity(Entity p_85031_1_)`
- `boolean interactFirst(EntityPlayer p_130002_1_)`
- `boolean isBurning()`
- `boolean isEating()`
- `boolean isEntityAlive()`
- `boolean isEntityEqual(Entity p_70028_1_)`
- `boolean isEntityInsideOpaqueBlock()`
- `boolean isEntityInvulnerable()`
- `boolean isImmuneToFire()`
- `boolean isInRangeToRender3d(double p_145770_1_, double p_145770_3_, double p_145770_5_)`
- `boolean isInRangeToRenderDist(double p_70112_1_)`
- `boolean isInsideOfMaterial(Material p_70055_1_)`
- `boolean isInvisible()`
- `boolean isInvisibleToPlayer(EntityPlayer p_98034_1_)`
- `boolean isInWater()`
- `boolean isOffsetPositionInLiquid(double p_70038_1_, double p_70038_3_, double p_70038_5_)`
- `boolean isPushedByWater()`
- `boolean isRiding()`
- `boolean isSneaking()`
- `boolean isSprinting()`
- `boolean isWet()`
- `protected void kill()`
- `void mountEntity(Entity p_70078_1_)`
- `void moveEntity(double p_70091_1_, double p_70091_3_, double p_70091_5_)`
- `void moveFlying(float p_70060_1_, float p_70060_2_, float p_70060_3_)`
- `protected NBTTagList newDoubleNBTList(double... p_70087_1_)`
- `protected NBTTagList newFloatNBTList(float... p_70049_1_)`
- `void onChunkLoad()`
- `void onCollideWithPlayer(EntityPlayer p_70100_1_)`
- `void onEntityUpdate()`
- `void onKillEntity(EntityLivingBase p_70074_1_)`
- `void onStruckByLightning(EntityLightningBolt p_70077_1_)`
- `void onUpdate()`
- `void performHurtAnimation()`
- `void playSound(java.lang.String p_85030_1_, float p_85030_2_, float p_85030_3_)`
- `protected void preparePlayerToSpawn()`
- `protected abstract void readEntityFromNBT(NBTTagCompound p_70037_1_)`
- `void readFromNBT(NBTTagCompound p_70020_1_)`
- `void setAir(int p_70050_1_)`
- `void setAngles(float p_70082_1_, float p_70082_2_)`
- `protected void setBeenAttacked()`
- `void setCurrentItemOrArmor(int p_70062_1_, ItemStack p_70062_2_)`
- `void setDead()`
- `void setEating(boolean p_70019_1_)`
- `void setEntityId(int p_145769_1_)`
- `void setFire(int p_70015_1_)`
- `protected void setFlag(int p_70052_1_, boolean p_70052_2_)`
- `void setInPortal()`
- `void setInvisible(boolean p_82142_1_)`
- `void setInWeb()`
- `void setLocationAndAngles(double p_70012_1_, double p_70012_3_, double p_70012_5_, float p_70012_7_, float p_70012_8_)`
- `protected void setOnFireFromLava()`
- `void setPosition(double p_70107_1_, double p_70107_3_, double p_70107_5_)`
- `void setPositionAndRotation(double p_70080_1_, double p_70080_3_, double p_70080_5_, float p_70080_7_, float p_70080_8_)`
- `void setPositionAndRotation2(double p_70056_1_, double p_70056_3_, double p_70056_5_, float p_70056_7_, float p_70056_8_, int p_70056_9_)`
- `protected void setRotation(float p_70101_1_, float p_70101_2_)`
- `void setRotationYawHead(float p_70034_1_)`
- `protected void setSize(float p_70105_1_, float p_70105_2_)`
- `void setSneaking(boolean p_70095_1_)`
- `void setSprinting(boolean p_70031_1_)`
- `void setVelocity(double p_70016_1_, double p_70016_3_, double p_70016_5_)`
- `void setWorld(World p_70029_1_)`
- `protected boolean shouldSetPosAfterLoading()`
- `java.lang.String toString()`
- `void travelToDimension(int p_71027_1_)`
- `protected void updateFallState(double p_70064_1_, boolean p_70064_3_)`
- `void updateRidden()`
- `void updateRiderPosition()`
- `protected abstract void writeEntityToNBT(NBTTagCompound p_70014_1_)`
- `boolean writeMountToNBT(NBTTagCompound p_98035_1_)`
- `void writeToNBT(NBTTagCompound p_70109_1_)`
- `boolean writeToNBTOptional(NBTTagCompound p_70039_1_)`

## Fields

- `boolean addedToChunk`
- `AxisAlignedBB boundingBox`
- `int chunkCoordX`
- `int chunkCoordY`
- `int chunkCoordZ`
- `protected DataWatcher dataWatcher`
- `int dimension`
- `float distanceWalkedModified`
- `float distanceWalkedOnStepModified`
- `float entityCollisionReduction`
- `protected java.util.UUID entityUniqueID`
- `float fallDistance`
- `boolean field_70135_K`
- `int fireResistance`
- `boolean forceSpawn`
- `float height`
- `int hurtResistantTime`
- `boolean ignoreFrustumCheck`
- `protected boolean inPortal`
- `protected boolean inWater`
- `boolean isAirBorne`
- `boolean isCollided`
- `boolean isCollidedHorizontally`
- `boolean isCollidedVertically`
- `boolean isDead`
- `protected boolean isImmuneToFire`
- `protected boolean isInWeb`
- `double lastTickPosX`
- `double lastTickPosY`
- `double lastTickPosZ`
- `double motionX`
- `double motionY`
- `double motionZ`
- `Entity.EnumEntitySize myEntitySize`
- `boolean noClip`
- `boolean onGround`
- `protected int portalCounter`
- `double posX`
- `double posY`
- `double posZ`
- `float prevDistanceWalkedModified`
- `boolean preventEntitySpawning`
- `double prevPosX`
- `double prevPosY`
- `double prevPosZ`
- `float prevRotationPitch`
- `float prevRotationYaw`
- `protected java.util.Random rand`
- `double renderDistanceWeight`
- `Entity riddenByEntity`
- `Entity ridingEntity`
- `float rotationPitch`
- `float rotationYaw`
- `int serverPosX`
- `int serverPosY`
- `int serverPosZ`
- `float stepHeight`
- `protected int teleportDirection`
- `int ticksExisted`
- `int timeUntilPortal`
- `boolean velocityChanged`
- `float width`
- `World worldObj`
- `float yOffset`
- `float ySize`
