# EntityGolem

## Class signature

```java
public abstract class EntityGolem extends EntityCreature implements IAnimals
```

## Constructors

- `public EntityGolem( World worldIn)`

## Methods

- `public void fall(float distance, float damageMultiplier)`
- `protected java.lang.String getLivingSound()`
- `protected java.lang.String getHurtSound()`
- `protected java.lang.String getDeathSound()`
- `public int getTalkInterval()`
- `protected boolean canDespawn()`

## Description

Determines if an entity can be despawned, used on idle far away entities