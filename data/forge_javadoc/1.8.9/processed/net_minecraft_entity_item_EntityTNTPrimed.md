# EntityTNTPrimed

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.item.EntityTNTPrimed

## Class signature

```java
public class EntityTNTPrimed extends Entity
```

## Constructors

- `EntityTNTPrimed(World worldIn)`
- `EntityTNTPrimed(World worldIn, double p_i1730_2_, double p_i1730_4_, double p_i1730_6_, EntityLivingBase p_i1730_8_)`

## Methods

- `boolean canBeCollidedWith()` — Returns true if other Entities should be prevented from moving through this Entity.
- `protected boolean canTriggerWalking()` — returns if this entity triggers Block.onEntityWalking on the blocks they walk on. used for spiders and wolves to prevent them from trampling crops
- `protected void entityInit()`
- `float getEyeHeight()`
- `EntityLivingBase getTntPlacedBy()` — returns null or the entityliving it was placed or ignited by
- `void onUpdate()` — Called to update the entity's position/logic.
- `protected void readEntityFromNBT(NBTTagCompound tagCompund)` — (abstract) Protected helper method to read subclass entity data from NBT.
- `protected void writeEntityToNBT(NBTTagCompound tagCompound)` — (abstract) Protected helper method to write subclass entity data to NBT.

## Fields

- `int fuse` — How long the fuse is