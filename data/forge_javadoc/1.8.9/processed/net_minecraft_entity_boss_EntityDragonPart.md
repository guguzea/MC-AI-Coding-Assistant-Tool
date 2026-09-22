# EntityDragonPart

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.boss.EntityDragonPart

## Class signature

```java
public class EntityDragonPart extends Entity
```

## Constructors

- `EntityDragonPart(IEntityMultiPart parent, java.lang.String partName, float base, float sizeHeight)`

## Methods

- `boolean attackEntityFrom(DamageSource source, float amount)` — Called when the entity is attacked.
- `boolean canBeCollidedWith()` — Returns true if other Entities should be prevented from moving through this Entity.
- `protected void entityInit()`
- `boolean isEntityEqual(Entity entityIn)` — Returns true if Entity argument is equal to this Entity
- `protected void readEntityFromNBT(NBTTagCompound tagCompund)` — (abstract) Protected helper method to read subclass entity data from NBT.
- `protected void writeEntityToNBT(NBTTagCompound tagCompound)` — (abstract) Protected helper method to write subclass entity data to NBT.

## Fields

- `IEntityMultiPart entityDragonObj` — The dragon entity this dragon part belongs to
- `java.lang.String partName`