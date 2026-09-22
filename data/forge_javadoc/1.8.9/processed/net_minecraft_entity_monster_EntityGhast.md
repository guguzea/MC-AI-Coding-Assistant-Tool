# EntityGhast

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.EntityLiving → net.minecraft.entity.EntityFlying → net.minecraft.entity.monster.EntityGhast

## Class signature

```java
public class EntityGhast extends EntityFlying implements IMob
```

## Methods

- `protected void applyEntityAttributes()`
- `boolean attackEntityFrom(DamageSource source, float amount)` — Called when the entity is attacked.
- `protected void dropFewItems(boolean p_70628_1_, int p_70628_2_)` — Drop 0-2 items of this living's type
- `protected void entityInit()`
- `boolean getCanSpawnHere()` — Checks if the entity's current position is a valid location to spawn this entity.
- `protected java.lang.String getDeathSound()` — Returns the sound this mob makes on death.
- `protected Item getDropItem()`
- `float getEyeHeight()`
- `int getFireballStrength()`
- `protected java.lang.String getHurtSound()` — Returns the sound this mob makes when it is hurt.
- `protected java.lang.String getLivingSound()` — Returns the sound this mob makes while it's alive.
- `int getMaxSpawnedInChunk()` — Will return how many at most can spawn in a chunk at once.
- `protected float getSoundVolume()` — Returns the volume for the sounds this mob makes.
- `boolean isAttacking()`
- `void onUpdate()` — Called to update the entity's position/logic.
- `void readEntityFromNBT(NBTTagCompound tagCompund)` — (abstract) Protected helper method to read subclass entity data from NBT.
- `void setAttacking(boolean p_175454_1_)`
- `void writeEntityToNBT(NBTTagCompound tagCompound)` — (abstract) Protected helper method to write subclass entity data to NBT.

## Fields

- `EntityGhast`