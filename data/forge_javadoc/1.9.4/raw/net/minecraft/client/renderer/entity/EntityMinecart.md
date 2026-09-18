---
title: "EntityMinecart"
description: "Returns true if this cart can be ridden by an Entity."
package: "net/minecraft/client/renderer/entity"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/entity/item/EntityMinecart.html"
sourceType: javadoc
---

# EntityMinecart

## Class signature

```java
public abstract class EntityMinecart extends Entity implements IWorldNameable
```

## Constructors

- `public EntityMinecart( World worldIn)`
- `public EntityMinecart( World worldIn, double x, double y, double z)`

## Methods

- `public static EntityMinecart create( World worldIn, double x, double y, double z, EntityMinecart.Type typeIn)`
- `protected boolean canTriggerWalking()`
- `protected void entityInit()`
- `@Nullable public AxisAlignedBB getCollisionBox( Entity entityIn)`
- `@Nullable public AxisAlignedBB getCollisionBoundingBox()`
- `public boolean canBePushed()`
- `public double getMountedYOffset()`
- `public boolean attackEntityFrom( DamageSource source, float amount)`
- `public void killMinecart( DamageSource source)`
- `public void performHurtAnimation()`
- `public boolean canBeCollidedWith()`
- `public void setDead()`
- `public EnumFacing getAdjustedHorizontalFacing()`
- `public void onUpdate()`
- `protected double getMaximumSpeed()`
- `public void onActivatorRailPass(int x, int y, int z, boolean receivingPower)`
- `protected void moveDerailedMinecart()`
- `protected void moveAlongTrack( BlockPos p_180460_1_, IBlockState p_180460_2_)`
- `protected void applyDrag()`
- `public void setPosition(double x, double y, double z)`
- `public Vec3d getPosOffset(double p_70495_1_, double p_70495_3_, double p_70495_5_, double p_70495_7_)`
- `public Vec3d getPos(double p_70489_1_, double p_70489_3_, double p_70489_5_)`
- `public AxisAlignedBB getRenderBoundingBox()`
- `protected void readEntityFromNBT( NBTTagCompound compound)`
- `protected void writeEntityToNBT( NBTTagCompound compound)`
- `public void applyEntityCollision( Entity entityIn)`
- `public void setPositionAndRotationDirect(double x, double y, double z, float yaw, float pitch, int posRotationIncrements, boolean teleport)`
- `public void setDamage(float damage)`
- `public void setVelocity(double x, double y, double z)`
- `public float getDamage()`
- `public void setRollingAmplitude(int rollingAmplitude)`
- `public int getRollingAmplitude()`
- `public void setRollingDirection(int rollingDirection)`
- `public int getRollingDirection()`
- `public abstract EntityMinecart.Type getType()`
- `public IBlockState getDisplayTile()`
- `public IBlockState getDefaultDisplayTile()`
- `public int getDisplayTileOffset()`
- `public int getDefaultDisplayTileOffset()`
- `public void setDisplayTile( IBlockState displayTile)`
- `public void setDisplayTileOffset(int displayTileOffset)`
- `public boolean hasDisplayTile()`
- `public void setHasDisplayTile(boolean showBlock)`
- `protected double getMaxSpeed()`
- `public void moveMinecartOnRail( BlockPos pos)`
- `public static IMinecartCollisionHandler getCollisionHandler()`
- `public static void setCollisionHandler( IMinecartCollisionHandler handler)`
- `public ItemStack getCartItem()`
- `public boolean canUseRail()`
- `public void setCanUseRail(boolean use)`
- `public boolean shouldDoRailFunctions()`
- `public boolean isPoweredCart()`
- `public boolean canBeRidden()`
- `public float getMaxCartSpeedOnRail()`
- `public final float getCurrentCartSpeedCapOnRail()`
- `public final void setCurrentCartSpeedCapOnRail(float value)`
- `public float getMaxSpeedAirLateral()`
- `public void setMaxSpeedAirLateral(float value)`
- `public float getMaxSpeedAirVertical()`
- `public void setMaxSpeedAirVertical(float value)`
- `public double getDragAir()`
- `public void setDragAir(double value)`
- `public double getSlopeAdjustment()`

## Description

Returns true if this cart can be ridden by an Entity.
