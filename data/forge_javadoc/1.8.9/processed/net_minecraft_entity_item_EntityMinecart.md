# EntityMinecart

## Class signature

```java
public abstract class EntityMinecart extends Entity implements IWorldNameable
```

## Constructors

- `public EntityMinecart( World worldIn)`
- `public EntityMinecart( World worldIn, double x, double y, double z)`

## Methods

- `public static EntityMinecart func_180458_a( World worldIn, double p_180458_1_, double p_180458_3_, double p_180458_5_, EntityMinecart.EnumMinecartType p_180458_7_)`
- `protected boolean canTriggerWalking()`
- `protected void entityInit()`
- `public AxisAlignedBB getCollisionBox( Entity entityIn)`
- `public AxisAlignedBB getCollisionBoundingBox()`
- `public boolean canBePushed()`
- `public double getMountedYOffset()`
- `public boolean attackEntityFrom( DamageSource source, float amount)`
- `public void killMinecart( DamageSource p_94095_1_)`
- `public void performHurtAnimation()`
- `public boolean canBeCollidedWith()`
- `public void setDead()`
- `public void onUpdate()`
- `protected double getMaximumSpeed()`
- `public void onActivatorRailPass(int x, int y, int z, boolean receivingPower)`
- `protected void moveDerailedMinecart()`
- `protected void func_180460_a( BlockPos p_180460_1_, IBlockState p_180460_2_)`
- `protected void applyDrag()`
- `public void setPosition(double x, double y, double z)`
- `public Vec3 func_70495_a(double p_70495_1_, double p_70495_3_, double p_70495_5_, double p_70495_7_)`
- `public Vec3 func_70489_a(double p_70489_1_, double p_70489_3_, double p_70489_5_)`
- `protected void readEntityFromNBT( NBTTagCompound tagCompund)`
- `protected void writeEntityToNBT( NBTTagCompound tagCompound)`
- `public void applyEntityCollision( Entity entityIn)`
- `public void setPositionAndRotation2(double x, double y, double z, float yaw, float pitch, int posRotationIncrements, boolean p_180426_10_)`
- `public void setDamage(float p_70492_1_)`
- `public void setVelocity(double x, double y, double z)`
- `public float getDamage()`
- `public void setRollingAmplitude(int p_70497_1_)`
- `public int getRollingAmplitude()`
- `public void setRollingDirection(int p_70494_1_)`
- `public int getRollingDirection()`
- `public abstract EntityMinecart.EnumMinecartType getMinecartType()`
- `public IBlockState getDisplayTile()`
- `public IBlockState getDefaultDisplayTile()`
- `public int getDisplayTileOffset()`
- `public int getDefaultDisplayTileOffset()`
- `public void func_174899_a( IBlockState p_174899_1_)`
- `public void setDisplayTileOffset(int p_94086_1_)`
- `public boolean hasDisplayTile()`
- `public void setHasDisplayTile(boolean p_94096_1_)`
- `public void setCustomNameTag(java.lang.String name)`
- `public java.lang.String getName()`
- `public boolean hasCustomName()`
- `public java.lang.String getCustomNameTag()`
- `public IChatComponent getDisplayName()`
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

Applies a velocity to each of the entities pushing them away from each other.