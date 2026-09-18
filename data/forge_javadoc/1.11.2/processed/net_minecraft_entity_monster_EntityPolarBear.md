# EntityPolarBear

## Class signature

```java
public class EntityPolarBear extends EntityAnimal
```

## Constructors

- `public EntityPolarBear( World worldIn)`

## Methods

- `public EntityAgeable createChild( EntityAgeable ageable)`
- `public boolean isBreedingItem( ItemStack stack)`
- `protected void initEntityAI()`
- `protected void applyEntityAttributes()`
- `protected SoundEvent getAmbientSound()`
- `protected SoundEvent getHurtSound()`
- `protected SoundEvent getDeathSound()`
- `protected void playStepSound( BlockPos pos, Block blockIn)`
- `protected void playWarningSound()`
- `@Nullable protected ResourceLocation getLootTable()`
- `protected void entityInit()`
- `public void onUpdate()`
- `public boolean attackEntityAsMob( Entity entityIn)`
- `public boolean isStanding()`
- `public void setStanding(boolean standing)`
- `public float getStandingAnimationScale(float p_189795_1_)`
- `protected float getWaterSlowDown()`
- `public IEntityLivingData onInitialSpawn( DifficultyInstance difficulty, IEntityLivingData livingdata)`