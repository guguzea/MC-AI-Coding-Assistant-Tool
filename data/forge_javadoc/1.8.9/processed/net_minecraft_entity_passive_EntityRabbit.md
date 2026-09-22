# EntityRabbit

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.EntityLiving → net.minecraft.entity.EntityCreature → net.minecraft.entity.EntityAgeable → net.minecraft.entity.passive.EntityAnimal → net.minecraft.entity.passive.EntityRabbit

## Class signature

```java
public class EntityRabbit extends EntityAnimal
```

## Methods

- `protected void addRandomDrop()` — Causes this Entity to drop a random item.
- `protected void applyEntityAttributes()`
- `boolean attackEntityAsMob(Entity entityIn)`
- `boolean attackEntityFrom(DamageSource source, float amount)` — Called when the entity is attacked.
- `EntityRabbit createChild(EntityAgeable ageable)`
- `protected void createEatingParticles()`
- `void doMovementAction(net.minecraft.entity.passive.EntityRabbit.EnumMoveType movetype)`
- `protected void dropFewItems(boolean p_70628_1_, int p_70628_2_)` — Drop 0-2 items of this living's type
- `protected void entityInit()`
- `float func_175521_o(float p_175521_1_)`
- `boolean func_175523_cj()`
- `protected java.lang.String getDeathSound()` — Returns the sound this mob makes on death.
- `protected java.lang.String getHurtSound()` — Returns the sound this mob makes when it is hurt.
- `protected java.lang.String getJumpingSound()`
- `protected float getJumpUpwardsMotion()`
- `protected java.lang.String getLivingSound()` — Returns the sound this mob makes while it's alive.
- `protected int getMoveTypeDuration()` — Returns duration of the current move type
- `int getRabbitType()`
- `int getTotalArmorValue()` — Returns the current armor value as determined by a call to InventoryPlayer.getTotalArmorValue
- `void handleStatusUpdate(byte id)`
- `boolean isBreedingItem(ItemStack stack)` — Checks if the parameter is an item which this animal can be fed to breed it (wheat, carrots or seeds depending on the animal type)
- `IEntityLivingData onInitialSpawn(DifficultyInstance difficulty, IEntityLivingData livingdata)` — Called only once on an entity when first time spawned, via egg, mob spawner, natural spawning etc, but not called when entity is reloaded from nbt.
- `void onLivingUpdate()` — Called frequently so the entity can update its state every tick as required.
- `void readEntityFromNBT(NBTTagCompound tagCompund)` — (abstract) Protected helper method to read subclass entity data from NBT.
- `void setJumping(boolean jump, net.minecraft.entity.passive.EntityRabbit.EnumMoveType moveTypeIn)`
- `void setMovementSpeed(double newSpeed)`
- `void setMoveType(net.minecraft.entity.passive.EntityRabbit.EnumMoveType type)`
- `void setRabbitType(int rabbitTypeId)`
- `void spawnRunningParticles()` — Attempts to create sprinting particles if the entity is sprinting and not in water.
- `void updateAITasks()`
- `void writeEntityToNBT(NBTTagCompound tagCompound)` — (abstract) Protected helper method to write subclass entity data to NBT.

## Fields

- `EntityRabbit`