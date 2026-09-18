---
title: "Entity"
description: "Setting this to true will prevent the world from calling onUpdate() for this entity."
package: "net/minecraftforge/fml/common/registry"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/entity/Entity.html"
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
- `public void turn(float yaw, float pitch)`
- `public void onUpdate()`
- `public void onEntityUpdate()`
- `protected void decrementTimeUntilPortal()`
- `public int getMaxInPortalTime()`
- `protected void setOnFireFromLava()`
- `public void setFire(int seconds)`
- `public void extinguish()`
- `protected void outOfWorld()`
- `public boolean isOffsetPositionInLiquid(double x, double y, double z)`
- `public void move( MoverType type, double x, double y, double z)`
- `public void resetPositionToBB()`
- `protected SoundEvent getSwimSound()`
- `protected SoundEvent getSplashSound()`
- `protected void doBlockCollisions()`
- `protected void onInsideBlock( IBlockState p_191955_1_)`
- `protected void playStepSound( BlockPos pos, Block blockIn)`
- `protected float playFlySound(float p_191954_1_)`
- `protected boolean makeFlySound()`
- `public void playSound( SoundEvent soundIn, float volume, float pitch)`
- `public boolean isSilent()`
- `public void setSilent(boolean isSilent)`
- `public boolean hasNoGravity()`
- `public void setNoGravity(boolean noGravity)`
- `protected boolean canTriggerWalking()`
- `protected void updateFallState(double y, boolean onGroundIn, IBlockState state, BlockPos pos)`
- `public AxisAlignedBB getCollisionBoundingBox()`
- `protected void dealFireDamage(int amount)`
- `public final boolean isImmuneToFire()`
- `public void fall(float distance, float damageMultiplier)`
- `public boolean isWet()`
- `public boolean isInWater()`
- `public boolean isOverWater()`
- `public boolean handleWaterMovement()`
- `protected void doWaterSplashEffect()`
- `public void spawnRunningParticles()`
- `protected void createRunningParticles()`
- `public boolean isInsideOfMaterial( Material materialIn)`
- `public boolean isInLava()`
- `public void moveRelative(float strafe, float up, float forward, float friction)`
- `public int getBrightnessForRender()`
- `public float getBrightness()`
- `public void setWorld( World worldIn)`
- `public void setPositionAndRotation(double x, double y, double z, float yaw, float pitch)`
- `public void moveToBlockPosAndAngles( BlockPos pos, float rotationYawIn, float rotationPitchIn)`
- `public void setLocationAndAngles(double x, double y, double z, float yaw, float pitch)`
- `public float getDistance( Entity entityIn)`
- `public double getDistanceSq(double x, double y, double z)`
- `public double getDistanceSq( BlockPos pos)`
- `public double getDistanceSqToCenter( BlockPos pos)`
- `public double getDistance(double x, double y, double z)`
- `public double getDistanceSq( Entity entityIn)`
- `public void onCollideWithPlayer( EntityPlayer entityIn)`
- `public void applyEntityCollision( Entity entityIn)`
- `public void addVelocity(double x, double y, double z)`
- `protected void markVelocityChanged()`
- `public boolean attackEntityFrom( DamageSource source, float amount)`
- `public Vec3d getLook(float partialTicks)`
- `protected final Vec3d getVectorForRotation(float pitch, float yaw)`
- `public Vec3d getPositionEyes(float partialTicks)`
- `public RayTraceResult rayTrace(double blockReachDistance, float partialTicks)`
- `public boolean canBeCollidedWith()`
- `public boolean canBePushed()`
- `public void awardKillScore( Entity p_191956_1_, int p_191956_2_, DamageSource p_191956_3_)`
- `public boolean isInRangeToRender3d(double x, double y, double z)`
- `public boolean isInRangeToRenderDist(double distance)`
- `public boolean writeToNBTAtomically( NBTTagCompound compound)`
- `public boolean writeToNBTOptional( NBTTagCompound compound)`
- `public static void registerFixes( DataFixer fixer)`
- `public NBTTagCompound writeToNBT( NBTTagCompound compound)`
- `public void readFromNBT( NBTTagCompound compound)`
- `protected boolean shouldSetPosAfterLoading()`
- `protected final java.lang.String getEntityString()`
- `protected abstract void readEntityFromNBT( NBTTagCompound compound)`
- `protected abstract void writeEntityToNBT( NBTTagCompound compound)`
- `protected NBTTagList newDoubleNBTList(double... numbers)`
- `protected NBTTagList newFloatNBTList(float... numbers)`
- `public EntityItem dropItem( Item itemIn, int size)`
- `public EntityItem dropItemWithOffset( Item itemIn, int size, float offsetY)`
- `public EntityItem entityDropItem( ItemStack stack, float offsetY)`
- `public boolean isEntityAlive()`
- `public boolean isEntityInsideOpaqueBlock()`
- `public boolean processInitialInteract( EntityPlayer player, EnumHand hand)`
- `public AxisAlignedBB getCollisionBox( Entity entityIn)`
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
- `public Vec2f getPitchYaw()`
- `public Vec3d getForward()`
- `public void setPortal( BlockPos pos)`
- `public int getPortalCooldown()`

## Description

Setting this to true will prevent the world from calling onUpdate() for this entity.
