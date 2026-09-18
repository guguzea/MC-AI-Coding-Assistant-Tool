# EntityHusk

## Class signature

```java
public class EntityHusk extends EntityZombie
```

## Constructors

- `public EntityHusk( World worldIn)`

## Methods

- `public static void registerFixesHusk( DataFixer fixer)`
- `public boolean getCanSpawnHere()`
- `protected boolean shouldBurnInDay()`
- `protected SoundEvent getAmbientSound()`
- `protected SoundEvent getHurtSound()`
- `protected SoundEvent getDeathSound()`
- `protected SoundEvent getStepSound()`
- `@Nullable protected ResourceLocation getLootTable()`
- `public boolean attackEntityAsMob( Entity entityIn)`
- `protected ItemStack getSkullDrop()`