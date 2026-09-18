# EntitySpider

## Class signature

```java
public class EntitySpider extends EntityMob
```

## Constructors

- `public EntitySpider( World worldIn)`

## Methods

- `public double getMountedYOffset()`
- `protected PathNavigate getNewNavigator( World worldIn)`
- `protected void entityInit()`
- `public void onUpdate()`
- `protected void applyEntityAttributes()`
- `protected java.lang.String getLivingSound()`
- `protected java.lang.String getHurtSound()`
- `protected java.lang.String getDeathSound()`
- `protected void playStepSound( BlockPos pos, Block blockIn)`
- `protected Item getDropItem()`
- `protected void dropFewItems(boolean p_70628_1_, int p_70628_2_)`
- `public boolean isOnLadder()`
- `public void setInWeb()`
- `public EnumCreatureAttribute getCreatureAttribute()`
- `public boolean isPotionApplicable( PotionEffect potioneffectIn)`
- `public boolean isBesideClimbableBlock()`
- `public void setBesideClimbableBlock(boolean p_70839_1_)`
- `public IEntityLivingData onInitialSpawn( DifficultyInstance difficulty, IEntityLivingData livingdata)`
- `public float getEyeHeight()`

## Description

Drop 0-2 items of this living's type