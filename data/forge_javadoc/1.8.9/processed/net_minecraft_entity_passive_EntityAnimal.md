# EntityAnimal

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.EntityLiving → net.minecraft.entity.EntityCreature → net.minecraft.entity.EntityAgeable → net.minecraft.entity.passive.EntityAnimal

## Class signature

```java
public abstract class EntityAnimal extends EntityAgeable implements IAnimals
```

## Constructors

- `EntityAnimal(World worldIn)`

## Methods

- `boolean attackEntityFrom(DamageSource source, float amount)` — Called when the entity is attacked.
- `protected boolean canDespawn()` — Determines if an entity can be despawned, used on idle far away entities
- `boolean canMateWith(EntityAnimal otherAnimal)` — Returns true if the mob is currently able to mate with the specified mob.
- `protected void consumeItemFromStack(EntityPlayer player, ItemStack stack)` — Decreases ItemStack size by one
- `float getBlockPathWeight(BlockPos pos)`
- `boolean getCanSpawnHere()` — Checks if the entity's current position is a valid location to spawn this entity.
- `protected int getExperiencePoints(EntityPlayer player)` — Get the experience points the entity currently has.
- `EntityPlayer getPlayerInLove()`
- `int getTalkInterval()` — Get number of ticks, at least during which the living entity will be silent.
- `void handleStatusUpdate(byte id)`
- `boolean interact(EntityPlayer player)` — Called when a player interacts with a mob. e.g. gets milk from a cow, gets into the saddle on a pig.
- `boolean isBreedingItem(ItemStack stack)` — Checks if the parameter is an item which this animal can be fed to breed it (wheat, carrots or seeds depending on the animal type)
- `boolean isInLove()` — Returns if the entity is currently in 'love mode'.
- `void onLivingUpdate()` — Called frequently so the entity can update its state every tick as required.
- `void readEntityFromNBT(NBTTagCompound tagCompund)` — (abstract) Protected helper method to read subclass entity data from NBT.
- `void resetInLove()`
- `void setInLove(EntityPlayer player)`
- `protected void updateAITasks()`
- `void writeEntityToNBT(NBTTagCompound tagCompound)` — (abstract) Protected helper method to write subclass entity data to NBT.

## Fields

- `protected Block spawnableBlock`