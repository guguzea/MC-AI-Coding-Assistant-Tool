---
title: "EntityBoat"
description: "public class EntityBoat extends Entity"
package: "net/minecraft/entity/item"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/entity/item/EntityBoat.html"
sourceType: javadoc
---

# EntityBoat

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.item.EntityBoat

## Class signature

```java
public class EntityBoat extends Entity
```

## Methods

- `void applyEntityCollision(Entity entityIn)`
- `void applyOrientationToEntity(Entity entityToUpdate)`
- `protected void applyYawToEntity(Entity entityToUpdate)`
- `boolean attackEntityFrom(DamageSource source, float amount)`
- `boolean canBeCollidedWith()`
- `boolean canBePushed()`
- `protected boolean canFitPassenger(Entity passenger)`
- `protected boolean canTriggerWalking()`
- `protected void entityInit()`
- `EnumFacing getAdjustedHorizontalFacing()`
- `static float getBlockLiquidHeight(IBlockState p_184456_0_, IBlockAccess p_184456_1_, BlockPos p_184456_2_)`
- `float getBoatGlide()`
- `EntityBoat.Type getBoatType()`
- `AxisAlignedBB getCollisionBoundingBox()`
- `AxisAlignedBB getCollisionBox(Entity entityIn)`
- `Entity getControllingPassenger()`
- `float getDamageTaken()`
- `int getForwardDirection()`
- `Item getItemBoat()`
- `static float getLiquidHeight(IBlockState p_184452_0_, IBlockAccess p_184452_1_, BlockPos p_184452_2_)`
- `double getMountedYOffset()`
- `boolean getPaddleState(int p_184457_1_)`
- `float getRowingTime(int p_184448_1_, float limbSwing)`
- `int getTimeSinceHit()`
- `float getWaterLevelAbove()`
- `void onUpdate()`
- `void performHurtAnimation()`
- `boolean processInitialInteract(EntityPlayer player, ItemStack stack, EnumHand hand)`
- `protected void readEntityFromNBT(NBTTagCompound compound)`
- `void setBoatType(EntityBoat.Type boatType)`
- `void setDamageTaken(float damageTaken)`
- `void setForwardDirection(int forwardDirection)`
- `void setPaddleState(boolean p_184445_1_, boolean p_184445_2_)`
- `void setPositionAndRotationDirect(double x, double y, double z, float yaw, float pitch, int posRotationIncrements, boolean teleport)`
- `void setTimeSinceHit(int timeSinceHit)`
- `protected void updateFallState(double y, boolean onGroundIn, IBlockState state, BlockPos pos)`
- `void updateInputs(boolean p_184442_1_, boolean p_184442_2_, boolean p_184442_3_, boolean p_184442_4_)`
- `void updatePassenger(Entity passenger)`
- `protected void writeEntityToNBT(NBTTagCompound compound)`

## Fields

- `EntityBoat`
- `EntityBoat`
