# EntityPig

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.EntityLiving → net.minecraft.entity.EntityCreature → net.minecraft.entity.EntityAgeable → net.minecraft.entity.passive.EntityAnimal → net.minecraft.entity.passive.EntityPig

## Class signature

```java
public class EntityPig extends EntityAnimal
```

## Methods

- `protected void applyEntityAttributes()`
- `boolean canBeSteered()` — returns true if all the conditions for steering the entity are met.
- `EntityPig createChild(EntityAgeable ageable)`
- `protected void dropFewItems(boolean p_70628_1_, int p_70628_2_)` — Drop 0-2 items of this living's type
- `protected void entityInit()`
- `void fall(float distance, float damageMultiplier)`
- `EntityAIControlledByPlayer getAIControlledByPlayer()` — Return the AI task for player control.
- `protected java.lang.String getDeathSound()` — Returns the sound this mob makes on death.
- `protected Item getDropItem()`
- `protected java.lang.String getHurtSound()` — Returns the sound this mob makes when it is hurt.
- `protected java.lang.String getLivingSound()` — Returns the sound this mob makes while it's alive.
- `boolean getSaddled()` — Returns true if the pig is saddled.
- `boolean interact(EntityPlayer player)` — Called when a player interacts with a mob. e.g. gets milk from a cow, gets into the saddle on a pig.
- `boolean isBreedingItem(ItemStack stack)` — Checks if the parameter is an item which this animal can be fed to breed it (wheat, carrots or seeds depending on the animal type)
- `void onStruckByLightning(EntityLightningBolt lightningBolt)` — Called when a lightning bolt hits the entity.
- `protected void playStepSound(BlockPos pos, Block blockIn)`
- `void readEntityFromNBT(NBTTagCompound tagCompund)` — (abstract) Protected helper method to read subclass entity data from NBT.
- `void setSaddled(boolean saddled)` — Set or remove the saddle of the pig.
- `void writeEntityToNBT(NBTTagCompound tagCompound)` — (abstract) Protected helper method to write subclass entity data to NBT.

## Fields

- `EntityPig`