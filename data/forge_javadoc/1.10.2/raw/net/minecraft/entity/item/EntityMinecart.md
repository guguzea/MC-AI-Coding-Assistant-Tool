---
title: "EntityMinecart"
description: "public abstract class EntityMinecart extends Entity implements IWorldNameable"
package: "net/minecraft/entity/item"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/entity/item/EntityMinecart.html"
sourceType: javadoc
---

# EntityMinecart

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.item.EntityMinecart

## Class signature

```java
public abstract class EntityMinecart extends Entity implements IWorldNameable
```

## Constructors

- `EntityMinecart(World worldIn)`
- `EntityMinecart(World worldIn, double x, double y, double z)`

## Methods

- `protected void applyDrag()`
- `void applyEntityCollision(Entity entityIn)`
- `boolean attackEntityFrom(DamageSource source, float amount)`
- `boolean canBeCollidedWith()`
- `boolean canBePushed()`
- `boolean canBeRidden()` — Returns true if this cart can be ridden by an Entity.
- `protected boolean canTriggerWalking()`
- `boolean canUseRail()` — Returns true if this cart can currently use rails.
- `static EntityMinecart create(World worldIn, double x, double y, double z, EntityMinecart.Type typeIn)`
- `protected void entityInit()`
- `EnumFacing getAdjustedHorizontalFacing()`
- `ItemStack getCartItem()` — This function returns an ItemStack that represents this cart.
- `AxisAlignedBB getCollisionBoundingBox()`
- `AxisAlignedBB getCollisionBox(Entity entityIn)`
- `static IMinecartCollisionHandler getCollisionHandler()` — Gets the current global Minecart Collision handler if none is registered, returns null
- `int getComparatorLevel()` — Called from Detector Rails to retrieve a redstone power level for comparators.
- `float getCurrentCartSpeedCapOnRail()` — Returns the current speed cap for the cart when traveling on rails.
- `float getDamage()`
- `IBlockState getDefaultDisplayTile()`
- `int getDefaultDisplayTileOffset()`
- `IBlockState getDisplayTile()`
- `int getDisplayTileOffset()`
- `double getDragAir()`
- `float getMaxCartSpeedOnRail()` — Returns the carts max speed when traveling on rails.
- `protected double getMaximumSpeed()`
- `protected double getMaxSpeed()`
- `float getMaxSpeedAirLateral()`
- `float getMaxSpeedAirVertical()`
- `double getMountedYOffset()`
- `Vec3d getPos(double p_70489_1_, double p_70489_3_, double p_70489_5_)`
- `Vec3d getPosOffset(double x, double y, double z, double offset)`
- `AxisAlignedBB getRenderBoundingBox()`
- `int getRollingAmplitude()`
- `int getRollingDirection()`
- `double getSlopeAdjustment()`
- `abstract EntityMinecart.Type getType()`
- `boolean hasDisplayTile()`
- `boolean isPoweredCart()` — Returns true if this cart is self propelled.
- `void killMinecart(DamageSource source)`
- `protected void moveAlongTrack(BlockPos pos, IBlockState state)`
- `protected void moveDerailedMinecart()`
- `void moveMinecartOnRail(BlockPos pos)` — Moved to allow overrides.
- `void onActivatorRailPass(int x, int y, int z, boolean receivingPower)`
- `void onUpdate()`
- `void performHurtAnimation()`
- `protected void readEntityFromNBT(NBTTagCompound compound)`
- `static void registerFixesMinecart(DataFixer fixer, java.lang.String name)`
- `void setCanUseRail(boolean use)` — Set whether the minecart can use rails.
- `static void setCollisionHandler(IMinecartCollisionHandler handler)` — Sets the global Minecart Collision handler, overwrites any that is currently set.
- `void setCurrentCartSpeedCapOnRail(float value)`
- `void setDamage(float damage)`
- `void setDead()`
- `void setDisplayTile(IBlockState displayTile)`
- `void setDisplayTileOffset(int displayTileOffset)`
- `void setDragAir(double value)`
- `void setHasDisplayTile(boolean showBlock)`
- `void setMaxSpeedAirLateral(float value)`
- `void setMaxSpeedAirVertical(float value)`
- `void setPosition(double x, double y, double z)`
- `void setPositionAndRotationDirect(double x, double y, double z, float yaw, float pitch, int posRotationIncrements, boolean teleport)`
- `void setRollingAmplitude(int rollingAmplitude)`
- `void setRollingDirection(int rollingDirection)`
- `void setVelocity(double x, double y, double z)`
- `boolean shouldDoRailFunctions()` — Return false if this cart should not call onMinecartPass() and should ignore Powered Rails.
- `protected void writeEntityToNBT(NBTTagCompound compound)`

## Fields

- `protected boolean canBePushed`
- `protected boolean canUseRail`
- `static double defaultDragAir`
- `static float defaultMaxSpeedAirLateral`
- `static float defaultMaxSpeedAirVertical`
- `protected double dragAir`
- `protected float maxSpeedAirLateral`
- `protected float maxSpeedAirVertical`
