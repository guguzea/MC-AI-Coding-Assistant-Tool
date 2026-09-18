# EntityGolem

## Class signature

```java
public abstract class EntityGolem extends EntityCreature implements IAnimals
```

## Constructors

- `public EntityGolem( World worldIn)`

## Methods

- `public void fall(float distance, float damageMultiplier)`
- `protected SoundEvent getAmbientSound()`
- `protected SoundEvent getHurtSound( DamageSource damageSourceIn)`
- `protected SoundEvent getDeathSound()`
- `public int getTalkInterval()`
- `protected boolean canDespawn()`