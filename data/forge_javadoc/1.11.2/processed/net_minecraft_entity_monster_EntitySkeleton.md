# EntitySkeleton

## Class signature

```java
public class EntitySkeleton extends AbstractSkeleton
```

## Constructors

- `public EntitySkeleton( World worldIn)`

## Methods

- `public static void registerFixesSkeleton( DataFixer fixer)`
- `@Nullable protected ResourceLocation getLootTable()`
- `protected SoundEvent getAmbientSound()`
- `protected SoundEvent getHurtSound()`
- `protected SoundEvent getDeathSound()`
- `public void onDeath( DamageSource cause)`
- `protected EntityArrow getArrow(float p_190726_1_)`