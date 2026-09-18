# EntitySpider

## Class signature

```java
public class EntitySpider extends EntityMob
```

## Constructors

- `public EntitySpider( World worldIn)`

## Methods

- `public static void registerFixesSpider( DataFixer fixer)`
- `protected void initEntityAI()`
- `public double getMountedYOffset()`
- `protected PathNavigate createNavigator( World worldIn)`
- `protected void entityInit()`
- `public void onUpdate()`
- `protected void applyEntityAttributes()`
- `protected SoundEvent getAmbientSound()`
- `protected SoundEvent getHurtSound( DamageSource damageSourceIn)`
- `protected SoundEvent getDeathSound()`
- `protected void playStepSound( BlockPos pos, Block blockIn)`
- `protected ResourceLocation getLootTable()`
- `public boolean isOnLadder()`
- `public void setInWeb()`
- `public EnumCreatureAttribute getCreatureAttribute()`
- `public boolean isPotionApplicable( PotionEffect potioneffectIn)`
- `public boolean isBesideClimbableBlock()`
- `public void setBesideClimbableBlock(boolean climbing)`
- `public IEntityLivingData onInitialSpawn( DifficultyInstance difficulty, IEntityLivingData livingdata)`
- `public float getEyeHeight()`