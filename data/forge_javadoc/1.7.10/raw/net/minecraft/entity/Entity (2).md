---
title: "Entity"
description: "public abstract class Entity extends java.lang.Object"
package: "net/minecraft/entity"
version: "1.7.10"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/net/minecraft/entity/Entity.html"
sourceType: javadoc
---

# Entity

## Class signature

```java
public abstract class Entity extends java.lang.Object
```

## Constructors

- `public Entity( World p_i1582_1_)`

## Methods

- `public int getEntityId()`
- `public void setEntityId(int p_145769_1_)`
- `protected abstract void entityInit()`
- `public DataWatcher getDataWatcher()`
- `public boolean equals(java.lang.Object p_equals_1_)`
- `public int hashCode()`
- `protected void preparePlayerToSpawn()`
- `public void setDead()`
- `protected void setSize(float p_70105_1_, float p_70105_2_)`
- `protected void setRotation(float p_70101_1_, float p_70101_2_)`
- `public void setPosition(double p_70107_1_, double p_70107_3_, double p_70107_5_)`
- `public void setAngles(float p_70082_1_, float p_70082_2_)`
- `public void onUpdate()`
- `public void onEntityUpdate()`
- `public int getMaxInPortalTime()`
- `protected void setOnFireFromLava()`
- `public void setFire(int p_70015_1_)`
- `public void extinguish()`
- `protected void kill()`
- `public boolean isOffsetPositionInLiquid(double p_70038_1_, double p_70038_3_, double p_70038_5_)`
- `public void moveEntity(double p_70091_1_, double p_70091_3_, double p_70091_5_)`
- `protected java.lang.String getSwimSound()`
- `protected void func_145775_I()`
- `protected void func_145780_a(int p_145780_1_, int p_145780_2_, int p_145780_3_, Block p_145780_4_)`
- `public void playSound(java.lang.String p_85030_1_, float p_85030_2_, float p_85030_3_)`
- `protected boolean canTriggerWalking()`
- `protected void updateFallState(double p_70064_1_, boolean p_70064_3_)`
- `public AxisAlignedBB getBoundingBox()`
- `protected void dealFireDamage(int p_70081_1_)`
- `public final boolean isImmuneToFire()`
- `protected void fall(float p_70069_1_)`
- `public boolean isWet()`
- `public boolean isInWater()`
- `public boolean handleWaterMovement()`
- `protected java.lang.String getSplashSound()`
- `public boolean isInsideOfMaterial( Material p_70055_1_)`
- `public float getEyeHeight()`
- `public boolean handleLavaMovement()`
- `public void moveFlying(float p_70060_1_, float p_70060_2_, float p_70060_3_)`
- `public int getBrightnessForRender(float p_70070_1_)`
- `public float getBrightness(float p_70013_1_)`
- `public void setWorld( World p_70029_1_)`
- `public void setPositionAndRotation(double p_70080_1_, double p_70080_3_, double p_70080_5_, float p_70080_7_, float p_70080_8_)`
- `public void setLocationAndAngles(double p_70012_1_, double p_70012_3_, double p_70012_5_, float p_70012_7_, float p_70012_8_)`
- `public float getDistanceToEntity( Entity p_70032_1_)`
- `public double getDistanceSq(double p_70092_1_, double p_70092_3_, double p_70092_5_)`
- `public double getDistance(double p_70011_1_, double p_70011_3_, double p_70011_5_)`
- `public double getDistanceSqToEntity( Entity p_70068_1_)`
- `public void onCollideWithPlayer( EntityPlayer p_70100_1_)`
- `public void applyEntityCollision( Entity p_70108_1_)`
- `public void addVelocity(double p_70024_1_, double p_70024_3_, double p_70024_5_)`
- `protected void setBeenAttacked()`
- `public boolean attackEntityFrom( DamageSource p_70097_1_, float p_70097_2_)`
- `public boolean canBeCollidedWith()`
- `public boolean canBePushed()`
- `public void addToPlayerScore( Entity p_70084_1_, int p_70084_2_)`
- `public boolean isInRangeToRender3d(double p_145770_1_, double p_145770_3_, double p_145770_5_)`
- `public boolean isInRangeToRenderDist(double p_70112_1_)`
- `public boolean writeMountToNBT( NBTTagCompound p_98035_1_)`
- `public boolean writeToNBTOptional( NBTTagCompound p_70039_1_)`
- `public void writeToNBT( NBTTagCompound p_70109_1_)`
- `public void readFromNBT( NBTTagCompound p_70020_1_)`
- `protected boolean shouldSetPosAfterLoading()`
- `protected final java.lang.String getEntityString()`
- `protected abstract void readEntityFromNBT( NBTTagCompound p_70037_1_)`
- `protected abstract void writeEntityToNBT( NBTTagCompound p_70014_1_)`
- `public void onChunkLoad()`
- `protected NBTTagList newDoubleNBTList(double... p_70087_1_)`
- `protected NBTTagList newFloatNBTList(float... p_70049_1_)`
- `public EntityItem dropItem( Item p_145779_1_, int p_145779_2_)`
- `public EntityItem func_145778_a( Item p_145778_1_, int p_145778_2_, float p_145778_3_)`
- `public EntityItem entityDropItem( ItemStack p_70099_1_, float p_70099_2_)`
- `public float getShadowSize()`
- `public boolean isEntityAlive()`
- `public boolean isEntityInsideOpaqueBlock()`
- `public boolean interactFirst( EntityPlayer p_130002_1_)`
- `public AxisAlignedBB getCollisionBox( Entity p_70114_1_)`
- `public void updateRidden()`
- `public void updateRiderPosition()`
- `public double getYOffset()`
- `public double getMountedYOffset()`
- `public void mountEntity( Entity p_70078_1_)`
- `public void setPositionAndRotation2(double p_70056_1_, double p_70056_3_, double p_70056_5_, float p_70056_7_, float p_70056_8_, int p_70056_9_)`
- `public float getCollisionBorderSize()`
- `public Vec3 getLookVec()`
- `public void setInPortal()`
- `public int getPortalCooldown()`
- `public void setVelocity(double p_70016_1_, double p_70016_3_, double p_70016_5_)`
- `public void handleHealthUpdate(byte p_70103_1_)`
- `public void performHurtAnimation()`
- `public ItemStack [] getLastActiveItems()`
- `public void setCurrentItemOrArmor(int p_70062_1_, ItemStack p_70062_2_)`
- `public boolean isBurning()`
- `public boolean isRiding()`
- `public boolean isSneaking()`
- `public void setSneaking(boolean p_70095_1_)`
- `public boolean isSprinting()`
- `public void setSprinting(boolean p_70031_1_)`
- `public boolean isInvisible()`
- `public boolean isInvisibleToPlayer( EntityPlayer p_98034_1_)`
- `public void setInvisible(boolean p_82142_1_)`
- `public boolean isEating()`
- `public void setEating(boolean p_70019_1_)`
- `protected boolean getFlag(int p_70083_1_)`
- `protected void setFlag(int p_70052_1_, boolean p_70052_2_)`
- `public int getAir()`
- `public void setAir(int p_70050_1_)`
- `public void onStruckByLightning( EntityLightningBolt p_70077_1_)`
- `public void onKillEntity( EntityLivingBase p_70074_1_)`
- `protected boolean func_145771_j(double p_145771_1_, double p_145771_3_, double p_145771_5_)`
- `public void setInWeb()`
- `public java.lang.String getCommandSenderName()`
- `public Entity [] getParts()`
- `public boolean isEntityEqual( Entity p_70028_1_)`
- `public float getRotationYawHead()`
- `public void setRotationYawHead(float p_70034_1_)`
- `public boolean canAttackWithItem()`
- `public boolean hitByEntity( Entity p_85031_1_)`
- `public java.lang.String toString()`
- `public boolean isEntityInvulnerable()`
