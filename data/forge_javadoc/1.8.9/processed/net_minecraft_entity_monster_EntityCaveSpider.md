# EntityCaveSpider

## Class signature

```java
public class EntityCaveSpider extends EntitySpider
```

## Constructors

- `public EntityCaveSpider( World worldIn)`

## Methods

- `protected void applyEntityAttributes()`
- `public boolean attackEntityAsMob( Entity entityIn)`
- `public IEntityLivingData onInitialSpawn( DifficultyInstance difficulty, IEntityLivingData livingdata)`
- `public float getEyeHeight()`

## Description

Called only once on an entity when first time spawned, via egg, mob spawner, natural spawning etc, but not called when entity is reloaded from nbt.