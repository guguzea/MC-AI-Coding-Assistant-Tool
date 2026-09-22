# EntityGolem

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.EntityLiving → net.minecraft.entity.EntityCreature → net.minecraft.entity.monster.EntityGolem

## Class signature

```java
public abstract class EntityGolem extends EntityCreature implements IAnimals
```

## Methods

- `protected boolean canDespawn()` — Determines if an entity can be despawned, used on idle far away entities
- `void fall(float distance, float damageMultiplier)`
- `protected java.lang.String getDeathSound()` — Returns the sound this mob makes on death.
- `protected java.lang.String getHurtSound()` — Returns the sound this mob makes when it is hurt.
- `protected java.lang.String getLivingSound()` — Returns the sound this mob makes while it's alive.
- `int getTalkInterval()` — Get number of ticks, at least during which the living entity will be silent.

## Fields

- `EntityGolem`