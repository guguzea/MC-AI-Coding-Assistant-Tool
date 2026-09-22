# EntitySlime

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.EntityLiving → net.minecraft.entity.monster.EntitySlime

## Class signature

```java
public class EntitySlime extends EntityLiving implements IMob
```

## Constructors

- `EntitySlime(World worldIn)`

## Methods

- `protected void alterSquishAmount()`
- `void applyEntityCollision(Entity entityIn)` — Applies a velocity to each of the entities pushing them away from each other.
- `protected boolean canDamagePlayer()` — Indicates weather the slime is able to damage the player (based upon the slime's size)
- `protected EntitySlime createInstance()`
- `protected void entityInit()`
- `protected void func_175451_e(EntityLivingBase p_175451_1_)`
- `protected int getAttackStrength()` — Gets the amount of damage dealt to the player when "attacked" by the slime.
- `boolean getCanSpawnHere()` — Checks if the entity's current position is a valid location to spawn this entity.
- `protected java.lang.String getDeathSound()` — Returns the sound this mob makes on death.
- `protected Item getDropItem()`
- `float getEyeHeight()`
- `protected java.lang.String getHurtSound()` — Returns the sound this mob makes when it is hurt.
- `protected int getJumpDelay()` — Gets the amount of time the slime needs to wait between jumps.
- `protected java.lang.String getJumpSound()` — Returns the name of the sound played when the slime jumps.
- `protected EnumParticleTypes getParticleType()`
- `int getSlimeSize()` — Returns the size of the slime.
- `protected float getSoundVolume()` — Returns the volume for the sounds this mob makes.
- `int getVerticalFaceSpeed()` — The speed it takes to move the entityliving's rotationPitch through the faceEntity method.
- `protected void jump()` — Causes this entity to do an upwards motion (jumping).
- `protected boolean makesSoundOnJump()` — Returns true if the slime makes a sound when it jumps (based upon the slime's size)
- `protected boolean makesSoundOnLand()` — Returns true if the slime makes a sound when it lands after a jump (based upon the slime's size)
- `void onCollideWithPlayer(EntityPlayer entityIn)` — Called by a player entity when they collide with an entity
- `void onDataWatcherUpdate(int dataID)`
- `IEntityLivingData onInitialSpawn(DifficultyInstance difficulty, IEntityLivingData livingdata)` — Called only once on an entity when first time spawned, via egg, mob spawner, natural spawning etc, but not called when entity is reloaded from nbt.
- `void onUpdate()` — Called to update the entity's position/logic.
- `void readEntityFromNBT(NBTTagCompound tagCompund)` — (abstract) Protected helper method to read subclass entity data from NBT.
- `void setDead()` — Will get destroyed next tick.
- `protected void setSlimeSize(int size)`
- `protected boolean spawnCustomParticles()` — Called when the slime spawns particles on landing, see onUpdate.
- `void writeEntityToNBT(NBTTagCompound tagCompound)` — (abstract) Protected helper method to write subclass entity data to NBT.

## Fields

- `float prevSquishFactor`
- `float squishAmount`
- `float squishFactor`