# EntityTameable

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.EntityLiving → net.minecraft.entity.EntityCreature → net.minecraft.entity.EntityAgeable → net.minecraft.entity.passive.EntityAnimal → net.minecraft.entity.passive.EntityTameable

## Class signature

```java
public abstract class EntityTameable extends EntityAnimal implements IEntityOwnable
```

## Constructors

- `EntityTameable(World worldIn)`

## Methods

- `protected void entityInit()`
- `EntityAISit getAISit()` — Returns the AITask responsible of the sit logic
- `EntityLivingBase getOwner()`
- `java.lang.String getOwnerId()`
- `Team getTeam()`
- `void handleStatusUpdate(byte id)`
- `boolean isOnSameTeam(EntityLivingBase otherEntity)`
- `boolean isOwner(EntityLivingBase entityIn)`
- `boolean isSitting()`
- `boolean isTamed()`
- `void onDeath(DamageSource cause)` — Called when the mob's health reaches 0.
- `protected void playTameEffect(boolean play)` — Play the taming effect, will either be hearts or smoke depending on status
- `void readEntityFromNBT(NBTTagCompound tagCompund)` — (abstract) Protected helper method to read subclass entity data from NBT.
- `void setOwnerId(java.lang.String ownerUuid)`
- `void setSitting(boolean sitting)`
- `void setTamed(boolean tamed)`
- `protected void setupTamedAI()`
- `boolean shouldAttackEntity(EntityLivingBase p_142018_1_, EntityLivingBase p_142018_2_)`
- `void writeEntityToNBT(NBTTagCompound tagCompound)` — (abstract) Protected helper method to write subclass entity data to NBT.

## Fields

- `protected EntityAISit aiSit`