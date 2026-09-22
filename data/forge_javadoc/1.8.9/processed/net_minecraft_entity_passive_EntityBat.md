# EntityBat

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.EntityLiving → net.minecraft.entity.passive.EntityAmbientCreature → net.minecraft.entity.passive.EntityBat

## Class signature

```java
public class EntityBat extends EntityAmbientCreature
```

## Methods

- `protected void applyEntityAttributes()`
- `boolean attackEntityFrom(DamageSource source, float amount)` — Called when the entity is attacked.
- `boolean canBePushed()` — Returns true if this entity should push and be pushed by other entities when colliding.
- `protected boolean canTriggerWalking()` — returns if this entity triggers Block.onEntityWalking on the blocks they walk on. used for spiders and wolves to prevent them from trampling crops
- `protected void collideWithEntity(Entity p_82167_1_)`
- `protected void collideWithNearbyEntities()`
- `boolean doesEntityNotTriggerPressurePlate()` — Return whether this entity should NOT trigger a pressure plate or a tripwire.
- `protected void entityInit()`
- `void fall(float distance, float damageMultiplier)`
- `boolean getCanSpawnHere()` — Checks if the entity's current position is a valid location to spawn this entity.
- `protected java.lang.String getDeathSound()` — Returns the sound this mob makes on death.
- `float getEyeHeight()`
- `protected java.lang.String getHurtSound()` — Returns the sound this mob makes when it is hurt.
- `boolean getIsBatHanging()`
- `protected java.lang.String getLivingSound()` — Returns the sound this mob makes while it's alive.
- `protected float getSoundPitch()` — Gets the pitch of living sounds in living entities.
- `protected float getSoundVolume()` — Returns the volume for the sounds this mob makes.
- `void onUpdate()` — Called to update the entity's position/logic.
- `void readEntityFromNBT(NBTTagCompound tagCompund)` — (abstract) Protected helper method to read subclass entity data from NBT.
- `void setIsBatHanging(boolean isHanging)`
- `protected void updateAITasks()`
- `protected void updateFallState(double y, boolean onGroundIn, Block blockIn, BlockPos pos)`
- `void writeEntityToNBT(NBTTagCompound tagCompound)` — (abstract) Protected helper method to write subclass entity data to NBT.

## Fields

- `EntityBat`