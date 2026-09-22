# EntityBoat

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.item.EntityBoat

## Class signature

```java
public class EntityBoat extends Entity
```

## Methods

- `protected void addPassenger(Entity passenger)`
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
- `float getBoatGlide()`
- `EntityBoat.Type getBoatType()`
- `AxisAlignedBB getCollisionBoundingBox()`
- `AxisAlignedBB getCollisionBox(Entity entityIn)`
- `Entity getControllingPassenger()`
- `float getDamageTaken()`
- `int getForwardDirection()`
- `Item getItemBoat()`
- `double getMountedYOffset()`
- `protected SoundEvent getPaddleSound()`
- `boolean getPaddleState(int side)`
- `float getRowingTime(int side, float limbSwing)`
- `int getTimeSinceHit()`
- `float getWaterLevelAbove()`
- `void onUpdate()`
- `void performHurtAnimation()`
- `boolean processInitialInteract(EntityPlayer player, EnumHand hand)`
- `protected void readEntityFromNBT(NBTTagCompound compound)`
- `void setBoatType(EntityBoat.Type boatType)`
- `void setDamageTaken(float damageTaken)`
- `void setForwardDirection(int forwardDirection)`
- `void setPaddleState(boolean left, boolean right)`
- `void setPositionAndRotationDirect(double x, double y, double z, float yaw, float pitch, int posRotationIncrements, boolean teleport)`
- `void setTimeSinceHit(int timeSinceHit)`
- `protected void updateFallState(double y, boolean onGroundIn, IBlockState state, BlockPos pos)`
- `void updateInputs(boolean p_184442_1_, boolean p_184442_2_, boolean p_184442_3_, boolean p_184442_4_)`
- `void updatePassenger(Entity passenger)`
- `protected void writeEntityToNBT(NBTTagCompound compound)`

## Fields

- `EntityBoat`
- `EntityBoat`