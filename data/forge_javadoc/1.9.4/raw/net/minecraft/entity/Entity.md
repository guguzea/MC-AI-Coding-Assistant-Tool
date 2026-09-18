---
title: "Entity"
description: "If a rider of this entity can interact with this entity."
package: "net/minecraft/entity"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/entity/Entity.html"
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
- `public java.util.Set<java.lang.String> getTags()`
- `public boolean addTag(java.lang.String tag)`
- `public boolean removeTag(java.lang.String tag)`
- `public void onKillCommand()`
- `protected abstract void entityInit()`
- `public EntityDataManager getDataManager()`
- `public boolean equals(java.lang.Object p_equals_1_)`
- `public int hashCode()`
- `protected void preparePlayerToSpawn()`
- `public void setDead()`
- `public void setDropItemsWhenDead(boolean dropWhenDead)`
- `protected void setSize(float width, float height)`
- `protected void setRotation(float yaw, float pitch)`
- `public void setPosition(double x, double y, double z)`
- `public void setAngles(float yaw, float pitch)`
- `public void onUpdate()`
- `public void onEntityUpdate()`
- `protected void decrementTimeUntilPortal()`
- `public int getMaxInPortalTime()`
- `protected void setOnFireFromLava()`
- `public void setFire(int seconds)`
- `public void extinguish()`
- `protected void kill()`
- `public boolean isOffsetPositionInLiquid(double x, double y, double z)`
- `public void moveEntity(double x, double y, double z)`
- `public void resetPositionToBB()`
- `protected SoundEvent getSwimSound()`
- `protected SoundEvent getSplashSound()`
- `protected void doBlockCollisions()`
- `protected void playStepSound( BlockPos pos, Block blockIn)`
- `public void playSound( SoundEvent soundIn, float volume, float pitch)`
- `public boolean isSilent()`
- `public void setSilent(boolean isSilent)`
- `protected boolean canTriggerWalking()`
- `protected void updateFallState(double y, boolean onGroundIn, IBlockState state, BlockPos pos)`
- `@Nullable public AxisAlignedBB getCollisionBoundingBox()`
- `protected void dealFireDamage(int amount)`
- `public final boolean isImmuneToFire()`
- `public void fall(float distance, float damageMultiplier)`
- `public boolean isWet()`
- `public boolean isInWater()`
- `public boolean handleWaterMovement()`
- `protected void resetHeight()`
- `public void spawnRunningParticles()`
- `protected void createRunningParticles()`
- `public boolean isInsideOfMaterial( Material materialIn)`
- `public boolean isInLava()`
- `public void moveRelative(float strafe, float forward, float friction)`
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
- `public Vec3d getLook(float partialTicks)`
- `protected final Vec3d getVectorForRotation(float pitch, float yaw)`
- `public Vec3d getPositionEyes(float partialTicks)`
- `@Nullable public RayTraceResult rayTrace(double blockReachDistance, float partialTicks)`
- `public boolean canBeCollidedWith()`
- `public boolean canBePushed()`
- `public void addToPlayerScore( Entity entityIn, int amount)`
- `public boolean isInRangeToRender3d(double x, double y, double z)`
- `public boolean isInRangeToRenderDist(double distance)`
- `public boolean writeToNBTAtomically( NBTTagCompound compound)`
- `public boolean writeToNBTOptional( NBTTagCompound compound)`
- `public NBTTagCompound writeToNBT( NBTTagCompound p_189511_1_)`
- `public void readFromNBT( NBTTagCompound compound)`
- `protected boolean shouldSetPosAfterLoading()`
- `protected final java.lang.String getEntityString()`
- `protected abstract void readEntityFromNBT( NBTTagCompound compound)`
- `protected abstract void writeEntityToNBT( NBTTagCompound compound)`
- `public void onChunkLoad()`
- `protected NBTTagList newDoubleNBTList(double... numbers)`
- `protected NBTTagList newFloatNBTList(float... numbers)`
- `public EntityItem dropItem( Item itemIn, int size)`
- `public EntityItem dropItemWithOffset( Item itemIn, int size, float offsetY)`
- `public EntityItem entityDropItem( ItemStack stack, float offsetY)`
- `public boolean isEntityAlive()`
- `public boolean isEntityInsideOpaqueBlock()`
- `public boolean processInitialInteract( EntityPlayer player, @Nullable ItemStack stack, EnumHand hand)`
- `@Nullable public AxisAlignedBB getCollisionBox( Entity entityIn)`
- `public void updateRidden()`
- `public void updatePassenger( Entity passenger)`
- `public void applyOrientationToEntity( Entity entityToUpdate)`
- `public double getYOffset()`
- `public double getMountedYOffset()`
- `public boolean startRiding( Entity entityIn)`
- `public boolean startRiding( Entity entityIn, boolean force)`
- `protected boolean canBeRidden( Entity entityIn)`
- `public void removePassengers()`
- `public void dismountRidingEntity()`
- `protected void addPassenger( Entity passenger)`
- `protected void removePassenger( Entity passenger)`
- `protected boolean canFitPassenger( Entity passenger)`
- `public void setPositionAndRotationDirect(double x, double y, double z, float yaw, float pitch, int posRotationIncrements, boolean teleport)`
- `public float getCollisionBorderSize()`
- `public Vec3d getLookVec()`
- `public void setPortal( BlockPos pos)`
- `public int getPortalCooldown()`
- `public void setVelocity(double x, double y, double z)`
- `public void handleStatusUpdate(byte id)`
- `public void performHurtAnimation()`
- `public java.lang.Iterable< ItemStack > getHeldEquipment()`
- `public java.lang.Iterable< ItemStack > getArmorInventoryList()`
- `public java.lang.Iterable< ItemStack > getEquipmentAndArmor()`
- `public void setItemStackToSlot( EntityEquipmentSlot slotIn, @Nullable ItemStack stack)`
- `public boolean isBurning()`

## Description

If a rider of this entity can interact with this entity.
