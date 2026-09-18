---
title: "Entity"
description: "Has this entity been added to the chunk its within"
package: "net/minecraft/entity/ai"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/Entity.html"
sourceType: javadoc
---

# Entity

## Class signature

```java
public abstract class Entity extends java.lang.Object implements ICommandSender , ICapabilitySerializable < NBTTagCompound >
```

## Constructors

- `public Entity( World worldIn)`

## Methods

- `public int getEntityId()`
- `public void setEntityId(int id)`
- `public void onKillCommand()`
- `protected abstract void entityInit()`
- `public DataWatcher getDataWatcher()`
- `public boolean equals(java.lang.Object p_equals_1_)`
- `public int hashCode()`
- `protected void preparePlayerToSpawn()`
- `public void setDead()`
- `protected void setSize(float width, float height)`
- `protected void setRotation(float yaw, float pitch)`
- `public void setPosition(double x, double y, double z)`
- `public void setAngles(float yaw, float pitch)`
- `public void onUpdate()`
- `public void onEntityUpdate()`
- `public int getMaxInPortalTime()`
- `protected void setOnFireFromLava()`
- `public void setFire(int seconds)`
- `public void extinguish()`
- `protected void kill()`
- `public boolean isOffsetPositionInLiquid(double x, double y, double z)`
- `public void moveEntity(double x, double y, double z)`
- `protected java.lang.String getSwimSound()`
- `protected void doBlockCollisions()`
- `protected void playStepSound( BlockPos pos, Block blockIn)`
- `public void playSound(java.lang.String name, float volume, float pitch)`
- `public boolean isSilent()`
- `public void setSilent(boolean isSilent)`
- `protected boolean canTriggerWalking()`
- `protected void updateFallState(double y, boolean onGroundIn, Block blockIn, BlockPos pos)`
- `public AxisAlignedBB getCollisionBoundingBox()`
- `protected void dealFireDamage(int amount)`
- `public final boolean isImmuneToFire()`
- `public void fall(float distance, float damageMultiplier)`
- `public boolean isWet()`
- `public boolean isInWater()`
- `public boolean handleWaterMovement()`
- `protected void resetHeight()`
- `public void spawnRunningParticles()`
- `protected void createRunningParticles()`
- `protected java.lang.String getSplashSound()`
- `public boolean isInsideOfMaterial( Material materialIn)`
- `public boolean isInLava()`
- `public void moveFlying(float strafe, float forward, float friction)`
- `public int getBrightnessForRender(float partialTicks)`
- `public float getBrightness(float partialTicks)`
- `public void setWorld( World worldIn)`
- `public void setPositionAndRotation(double x, double y, double z, float yaw, float pitch)`
- `public void moveToBlockPosAndAngles( BlockPos pos, float rotationYawIn, float rotationPitchIn)`
- `public void setLocationAndAngles(double x, double y, double z, float yaw, float pitch)`
- `public float getDistanceToEntity( Entity entityIn)`
- `public double getDistanceSq(double x, double y, double z)`
- `public double getDistanceSq( BlockPos pos)`
- `public double getDistanceSqToCenter( BlockPos pos)`
- `public double getDistance(double x, double y, double z)`
- `public double getDistanceSqToEntity( Entity entityIn)`
- `public void onCollideWithPlayer( EntityPlayer entityIn)`
- `public void applyEntityCollision( Entity entityIn)`
- `public void addVelocity(double x, double y, double z)`
- `protected void setBeenAttacked()`
- `public boolean attackEntityFrom( DamageSource source, float amount)`
- `public Vec3 getLook(float partialTicks)`
- `protected final Vec3 getVectorForRotation(float pitch, float yaw)`
- `public Vec3 getPositionEyes(float partialTicks)`
- `public MovingObjectPosition rayTrace(double blockReachDistance, float partialTicks)`
- `public boolean canBeCollidedWith()`
- `public boolean canBePushed()`
- `public void addToPlayerScore( Entity entityIn, int amount)`
- `public boolean isInRangeToRender3d(double x, double y, double z)`
- `public boolean isInRangeToRenderDist(double distance)`
- `public boolean writeMountToNBT( NBTTagCompound tagCompund)`
- `public boolean writeToNBTOptional( NBTTagCompound tagCompund)`
- `public void writeToNBT( NBTTagCompound tagCompund)`
- `public void readFromNBT( NBTTagCompound tagCompund)`
- `protected boolean shouldSetPosAfterLoading()`
- `protected final java.lang.String getEntityString()`
- `protected abstract void readEntityFromNBT( NBTTagCompound tagCompund)`
- `protected abstract void writeEntityToNBT( NBTTagCompound tagCompound)`
- `public void onChunkLoad()`
- `protected NBTTagList newDoubleNBTList(double... numbers)`
- `protected NBTTagList newFloatNBTList(float... numbers)`
- `public EntityItem dropItem( Item itemIn, int size)`
- `public EntityItem dropItemWithOffset( Item itemIn, int size, float offsetY)`
- `public EntityItem entityDropItem( ItemStack itemStackIn, float offsetY)`
- `public boolean isEntityAlive()`
- `public boolean isEntityInsideOpaqueBlock()`
- `public boolean interactFirst( EntityPlayer playerIn)`
- `public AxisAlignedBB getCollisionBox( Entity entityIn)`
- `public void updateRidden()`
- `public void updateRiderPosition()`
- `public double getYOffset()`
- `public double getMountedYOffset()`
- `public void mountEntity( Entity entityIn)`
- `public void setPositionAndRotation2(double x, double y, double z, float yaw, float pitch, int posRotationIncrements, boolean p_180426_10_)`
- `public float getCollisionBorderSize()`
- `public Vec3 getLookVec()`
- `public void setPortal( BlockPos p_181015_1_)`
- `public int getPortalCooldown()`
- `public void setVelocity(double x, double y, double z)`
- `public void handleStatusUpdate(byte id)`
- `public void performHurtAnimation()`
- `public ItemStack [] getInventory()`
- `public void setCurrentItemOrArmor(int slotIn, ItemStack stack)`
- `public boolean isBurning()`
- `public boolean isRiding()`
- `public boolean isSneaking()`
- `public void setSneaking(boolean sneaking)`
- `public boolean isSprinting()`
- `public void setSprinting(boolean sprinting)`
- `public boolean isInvisible()`
- `public boolean isInvisibleToPlayer( EntityPlayer player)`
- `public void setInvisible(boolean invisible)`
- `public boolean isEating()`
- `public void setEating(boolean eating)`
- `protected boolean getFlag(int flag)`
- `protected void setFlag(int flag, boolean set)`
- `public int getAir()`
- `public void setAir(int air)`
- `public void onStruckByLightning( EntityLightningBolt lightningBolt)`
- `public void onKillEntity( EntityLivingBase entityLivingIn)`

## Description

Has this entity been added to the chunk its within
