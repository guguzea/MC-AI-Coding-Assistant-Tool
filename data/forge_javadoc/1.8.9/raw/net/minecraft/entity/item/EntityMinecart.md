---
title: "EntityMinecart"
description: "public abstract class EntityMinecart extends Entity implements IWorldNameable"
package: "net/minecraft/entity/item"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/item/EntityMinecart.html"
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
- `void applyEntityCollision(Entity entityIn)` — Applies a velocity to each of the entities pushing them away from each other.
- `boolean attackEntityFrom(DamageSource source, float amount)` — Called when the entity is attacked.
- `boolean canBeCollidedWith()` — Returns true if other Entities should be prevented from moving through this Entity.
- `boolean canBePushed()` — Returns true if this entity should push and be pushed by other entities when colliding.
- `boolean canBeRidden()` — Returns true if this cart can be ridden by an Entity.
- `protected boolean canTriggerWalking()` — returns if this entity triggers Block.onEntityWalking on the blocks they walk on. used for spiders and wolves to prevent them from trampling crops
- `boolean canUseRail()` — Returns true if this cart can currently use rails.
- `protected void entityInit()`
- `void func_174899_a(IBlockState p_174899_1_)`
- `static EntityMinecart func_180458_a(World worldIn, double p_180458_1_, double p_180458_3_, double p_180458_5_, EntityMinecart.EnumMinecartType p_180458_7_)`
- `protected void func_180460_a(BlockPos p_180460_1_, IBlockState p_180460_2_)`
- `Vec3 func_70489_a(double p_70489_1_, double p_70489_3_, double p_70489_5_)`
- `Vec3 func_70495_a(double p_70495_1_, double p_70495_3_, double p_70495_5_, double p_70495_7_)`
- `ItemStack getCartItem()` — This function returns an ItemStack that represents this cart.
- `AxisAlignedBB getCollisionBoundingBox()` — Returns the collision bounding box for this entity
- `AxisAlignedBB getCollisionBox(Entity entityIn)` — Returns a boundingBox used to collide the entity with other entities and blocks.
- `static IMinecartCollisionHandler getCollisionHandler()` — Gets the current global Minecart Collision handler if none is registered, returns null
- `float getCurrentCartSpeedCapOnRail()` — Returns the current speed cap for the cart when traveling on rails.
- `java.lang.String getCustomNameTag()`
- `float getDamage()` — Gets the current amount of damage the minecart has taken.
- `IBlockState getDefaultDisplayTile()`
- `int getDefaultDisplayTileOffset()`
- `IChatComponent getDisplayName()` — Get the formatted ChatComponent that will be used for the sender's username in chat
- `IBlockState getDisplayTile()`
- `int getDisplayTileOffset()`
- `double getDragAir()`
- `float getMaxCartSpeedOnRail()` — Returns the carts max speed when traveling on rails.
- `protected double getMaximumSpeed()` — Get's the maximum speed for a minecart
- `protected double getMaxSpeed()`
- `float getMaxSpeedAirLateral()`
- `float getMaxSpeedAirVertical()`
- `abstract EntityMinecart.EnumMinecartType getMinecartType()`
- `double getMountedYOffset()` — Returns the Y offset from the entity's position for any entity riding this one.
- `java.lang.String getName()` — Get the name of this object.
- `int getRollingAmplitude()` — Gets the rolling amplitude the cart rolls while being attacked.
- `int getRollingDirection()` — Gets the rolling direction the cart rolls while being attacked.
- `double getSlopeAdjustment()`
- `boolean hasCustomName()` — Returns true if this thing is named
- `boolean hasDisplayTile()`
- `boolean isPoweredCart()` — Returns true if this cart is self propelled.
- `void killMinecart(DamageSource p_94095_1_)`
- `protected void moveDerailedMinecart()` — Moves a minecart that is not attached to a rail
- `void moveMinecartOnRail(BlockPos pos)` — Moved to allow overrides.
- `void onActivatorRailPass(int x, int y, int z, boolean receivingPower)` — Called every tick the minecart is on an activator rail.
- `void onUpdate()` — Called to update the entity's position/logic.
- `void performHurtAnimation()` — Setups the entity to do the hurt animation.
- `protected void readEntityFromNBT(NBTTagCompound tagCompund)` — (abstract) Protected helper method to read subclass entity data from NBT.
- `void setCanUseRail(boolean use)` — Set whether the minecart can use rails.
- `static void setCollisionHandler(IMinecartCollisionHandler handler)` — Sets the global Minecart Collision handler, overwrites any that is currently set.
- `void setCurrentCartSpeedCapOnRail(float value)`
- `void setCustomNameTag(java.lang.String name)` — Sets the custom name tag for this entity
- `void setDamage(float p_70492_1_)` — Sets the current amount of damage the minecart has taken.
- `void setDead()` — Will get destroyed next tick.
- `void setDisplayTileOffset(int p_94086_1_)`
- `void setDragAir(double value)`
- `void setHasDisplayTile(boolean p_94096_1_)`
- `void setMaxSpeedAirLateral(float value)`
- `void setMaxSpeedAirVertical(float value)`
- `void setPosition(double x, double y, double z)` — Sets the x,y,z of the entity from the given parameters.
- `void setPositionAndRotation2(double x, double y, double z, float yaw, float pitch, int posRotationIncrements, boolean p_180426_10_)`
- `void setRollingAmplitude(int p_70497_1_)` — Sets the rolling amplitude the cart rolls while being attacked.
- `void setRollingDirection(int p_70494_1_)` — Sets the rolling direction the cart rolls while being attacked.
- `void setVelocity(double x, double y, double z)` — Sets the velocity to the args.
- `boolean shouldDoRailFunctions()` — Return false if this cart should not call onMinecartPass() and should ignore Powered Rails.
- `protected void writeEntityToNBT(NBTTagCompound tagCompound)` — (abstract) Protected helper method to write subclass entity data to NBT.

## Fields

- `protected boolean canBePushed`
- `protected boolean canUseRail`
- `static double defaultDragAir`
- `static float defaultMaxSpeedAirLateral`
- `static float defaultMaxSpeedAirVertical`
- `protected double dragAir`
- `protected float maxSpeedAirLateral`
- `protected float maxSpeedAirVertical`
