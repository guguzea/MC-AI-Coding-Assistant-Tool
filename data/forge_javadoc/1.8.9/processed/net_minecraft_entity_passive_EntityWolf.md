# EntityWolf

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.EntityLiving → net.minecraft.entity.EntityCreature → net.minecraft.entity.EntityAgeable → net.minecraft.entity.passive.EntityAnimal → net.minecraft.entity.passive.EntityTameable → net.minecraft.entity.passive.EntityWolf

## Class signature

```java
public class EntityWolf extends EntityTameable
```

## Methods

- `boolean allowLeashing()`
- `protected void applyEntityAttributes()`
- `boolean attackEntityAsMob(Entity entityIn)`
- `boolean attackEntityFrom(DamageSource source, float amount)` — Called when the entity is attacked.
- `protected boolean canDespawn()` — Determines if an entity can be despawned, used on idle far away entities
- `boolean canMateWith(EntityAnimal otherAnimal)` — Returns true if the mob is currently able to mate with the specified mob.
- `EntityWolf createChild(EntityAgeable ageable)`
- `protected void entityInit()`
- `EnumDyeColor getCollarColor()`
- `protected java.lang.String getDeathSound()` — Returns the sound this mob makes on death.
- `protected Item getDropItem()`
- `float getEyeHeight()`
- `protected java.lang.String getHurtSound()` — Returns the sound this mob makes when it is hurt.
- `float getInterestedAngle(float p_70917_1_)`
- `protected java.lang.String getLivingSound()` — Returns the sound this mob makes while it's alive.
- `int getMaxSpawnedInChunk()` — Will return how many at most can spawn in a chunk at once.
- `float getShadingWhileWet(float p_70915_1_)` — Used when calculating the amount of shading to apply while the wolf is wet.
- `float getShakeAngle(float p_70923_1_, float p_70923_2_)`
- `protected float getSoundVolume()` — Returns the volume for the sounds this mob makes.
- `float getTailRotation()`
- `int getVerticalFaceSpeed()` — The speed it takes to move the entityliving's rotationPitch through the faceEntity method.
- `void handleStatusUpdate(byte id)`
- `boolean interact(EntityPlayer player)` — Called when a player interacts with a mob. e.g. gets milk from a cow, gets into the saddle on a pig.
- `boolean isAngry()` — Determines whether this wolf is angry or not.
- `boolean isBegging()`
- `boolean isBreedingItem(ItemStack stack)` — Checks if the parameter is an item which this animal can be fed to breed it (wheat, carrots or seeds depending on the animal type)
- `boolean isWolfWet()` — True if the wolf is wet
- `void onLivingUpdate()` — Called frequently so the entity can update its state every tick as required.
- `void onUpdate()` — Called to update the entity's position/logic.
- `protected void playStepSound(BlockPos pos, Block blockIn)`
- `void readEntityFromNBT(NBTTagCompound tagCompund)` — (abstract) Protected helper method to read subclass entity data from NBT.
- `void setAngry(boolean angry)` — Sets whether this wolf is angry or not.
- `void setAttackTarget(EntityLivingBase entitylivingbaseIn)` — Sets the active target the Task system uses for tracking
- `void setBegging(boolean beg)`
- `void setCollarColor(EnumDyeColor collarcolor)`
- `void setTamed(boolean tamed)`
- `boolean shouldAttackEntity(EntityLivingBase p_142018_1_, EntityLivingBase p_142018_2_)`
- `protected void updateAITasks()`
- `void writeEntityToNBT(NBTTagCompound tagCompound)` — (abstract) Protected helper method to write subclass entity data to NBT.

## Fields

- `EntityWolf`