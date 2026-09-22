# EntityBoat

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.item.EntityBoat

## Class signature

```java
public class EntityBoat extends Entity
```

## Methods

- `boolean attackEntityFrom(DamageSource source, float amount)` — Called when the entity is attacked.
- `boolean canBeCollidedWith()` — Returns true if other Entities should be prevented from moving through this Entity.
- `boolean canBePushed()` — Returns true if this entity should push and be pushed by other entities when colliding.
- `protected boolean canTriggerWalking()` — returns if this entity triggers Block.onEntityWalking on the blocks they walk on. used for spiders and wolves to prevent them from trampling crops
- `protected void entityInit()`
- `AxisAlignedBB getCollisionBoundingBox()` — Returns the collision bounding box for this entity
- `AxisAlignedBB getCollisionBox(Entity entityIn)` — Returns a boundingBox used to collide the entity with other entities and blocks.
- `float getDamageTaken()` — Gets the damage taken from the last hit.
- `int getForwardDirection()` — Gets the forward direction of the entity.
- `double getMountedYOffset()` — Returns the Y offset from the entity's position for any entity riding this one.
- `int getTimeSinceHit()` — Gets the time since the last hit.
- `boolean interactFirst(EntityPlayer playerIn)` — First layer of player interaction
- `void onUpdate()` — Called to update the entity's position/logic.
- `void performHurtAnimation()` — Setups the entity to do the hurt animation.
- `protected void readEntityFromNBT(NBTTagCompound tagCompund)` — (abstract) Protected helper method to read subclass entity data from NBT.
- `void setDamageTaken(float p_70266_1_)` — Sets the damage taken from the last hit.
- `void setForwardDirection(int p_70269_1_)` — Sets the forward direction of the entity.
- `void setIsBoatEmpty(boolean p_70270_1_)` — true if no player in boat
- `void setPositionAndRotation2(double x, double y, double z, float yaw, float pitch, int posRotationIncrements, boolean p_180426_10_)`
- `void setTimeSinceHit(int p_70265_1_)` — Sets the time to count down from since the last time entity was hit.
- `void setVelocity(double x, double y, double z)` — Sets the velocity to the args.
- `protected void updateFallState(double y, boolean onGroundIn, Block blockIn, BlockPos pos)`
- `void updateRiderPosition()`
- `protected void writeEntityToNBT(NBTTagCompound tagCompound)` — (abstract) Protected helper method to write subclass entity data to NBT.

## Fields

- `EntityBoat`
- `EntityBoat`