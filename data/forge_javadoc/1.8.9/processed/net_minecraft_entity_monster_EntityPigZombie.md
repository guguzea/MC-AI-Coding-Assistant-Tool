# EntityPigZombie

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.EntityLiving → net.minecraft.entity.EntityCreature → net.minecraft.entity.monster.EntityMob → net.minecraft.entity.monster.EntityZombie → net.minecraft.entity.monster.EntityPigZombie

## Class signature

```java
public class EntityPigZombie extends EntityZombie
```

## Methods

- `protected void addRandomDrop()` — Causes this Entity to drop a random item.
- `protected void applyEntityAI()`
- `protected void applyEntityAttributes()`
- `boolean attackEntityFrom(DamageSource source, float amount)` — Called when the entity is attacked.
- `protected void dropFewItems(boolean p_70628_1_, int p_70628_2_)` — Drop 0-2 items of this living's type
- `boolean getCanSpawnHere()` — Checks if the entity's current position is a valid location to spawn this entity.
- `protected java.lang.String getDeathSound()` — Returns the sound this mob makes on death.
- `protected java.lang.String getHurtSound()` — Returns the sound this mob makes when it is hurt.
- `protected java.lang.String getLivingSound()` — Returns the sound this mob makes while it's alive.
- `boolean interact(EntityPlayer player)` — Called when a player interacts with a mob. e.g. gets milk from a cow, gets into the saddle on a pig.
- `boolean isAngry()`
- `boolean isNotColliding()` — Checks that the entity is not colliding with any blocks / liquids
- `IEntityLivingData onInitialSpawn(DifficultyInstance difficulty, IEntityLivingData livingdata)` — Called only once on an entity when first time spawned, via egg, mob spawner, natural spawning etc, but not called when entity is reloaded from nbt.
- `void onUpdate()` — Called to update the entity's position/logic.
- `void readEntityFromNBT(NBTTagCompound tagCompund)` — (abstract) Protected helper method to read subclass entity data from NBT.
- `protected void setEquipmentBasedOnDifficulty(DifficultyInstance difficulty)` — Gives armor or weapon for entity based on given DifficultyInstance
- `void setRevengeTarget(EntityLivingBase livingBase)`
- `protected void updateAITasks()`
- `void writeEntityToNBT(NBTTagCompound tagCompound)` — (abstract) Protected helper method to write subclass entity data to NBT.

## Fields

- `EntityPigZombie`