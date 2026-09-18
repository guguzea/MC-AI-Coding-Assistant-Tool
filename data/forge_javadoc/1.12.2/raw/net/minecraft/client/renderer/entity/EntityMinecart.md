---
title: "EntityMinecart"
description: "Returns true if this cart can be ridden by an Entity."
package: "net/minecraft/client/renderer/entity"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/entity/item/EntityMinecart.html"
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
- `public AxisAlignedBB getCollisionBox( Entity entityIn)`
- `public AxisAlignedBB getCollisionBoundingBox()`
- `public boolean canBePushed()`
- `public double getMountedYOffset()`
- `public boolean attackEntityFrom( DamageSource source, float amount)`
- `public void killMinecart( DamageSource source)`
- `public void performHurtAnimation()`
- `public boolean canBeCollidedWith()`
- `public EnumFacing getAdjustedHorizontalFacing()`
- `public void onUpdate()`
- `protected double getMaximumSpeed()`
- `public void onActivatorRailPass(int x, int y, int z, boolean receivingPower)`
- `protected void moveDerailedMinecart()`
- `protected void moveAlongTrack( BlockPos pos, IBlockState state)`
- `protected void applyDrag()`
- `public void setPosition(double x, double y, double z)`
- `public Vec3d getPosOffset(double x, double y, double z, double offset)`
- `public Vec3d getPos(double p_70489_1_, double p_70489_3_, double p_70489_5_)`
- `public AxisAlignedBB getRenderBoundingBox()`
- `public static void registerFixesMinecart( DataFixer fixer, java.lang.Class<?> name)`
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
- `public boolean processInitialInteract( EntityPlayer player, EnumHand hand)`
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
- `public int getComparatorLevel()`

## Description

Returns true if this cart can be ridden by an Entity.
