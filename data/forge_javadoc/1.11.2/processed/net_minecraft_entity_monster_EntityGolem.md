# EntityGolem

## Class signature

```java
public abstract class EntityGolem extends EntityCreature implements IAnimals
```

## Constructors

- `public EntityGolem( World worldIn)`

## Methods

- `public void fall(float distance, float damageMultiplier)`
- `@Nullable protected SoundEvent getAmbientSound()`
- `@Nullable protected SoundEvent getHurtSound()`
- `@Nullable protected SoundEvent getDeathSound()`
- `public int getTalkInterval()`
- `protected boolean canDespawn()`