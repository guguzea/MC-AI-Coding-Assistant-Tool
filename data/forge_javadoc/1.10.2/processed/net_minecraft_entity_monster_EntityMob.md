# EntityMob

## Class signature

```java
public abstract class EntityMob extends EntityCreature implements IMob
```

## Constructors

- `public EntityMob( World worldIn)`

## Methods

- `public static void registerFixesMonster( DataFixer fixer)`
- `public SoundCategory getSoundCategory()`
- `public void onLivingUpdate()`
- `public void onUpdate()`
- `protected SoundEvent getSwimSound()`
- `protected SoundEvent getSplashSound()`
- `public boolean attackEntityFrom( DamageSource source, float amount)`
- `protected SoundEvent getHurtSound()`
- `protected SoundEvent getDeathSound()`
- `protected SoundEvent getFallSound(int heightIn)`
- `public boolean attackEntityAsMob( Entity entityIn)`
- `public float getBlockPathWeight( BlockPos pos)`
- `protected boolean isValidLightLevel()`
- `public boolean getCanSpawnHere()`
- `protected void applyEntityAttributes()`
- `protected boolean canDropLoot()`