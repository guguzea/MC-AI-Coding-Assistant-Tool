# EntityIllusionIllager

## Class signature

```java
public class EntityIllusionIllager extends EntitySpellcasterIllager implements IRangedAttackMob
```

## Constructors

- `public EntityIllusionIllager( World worldIn)`

## Methods

- `protected void initEntityAI()`
- `protected void applyEntityAttributes()`
- `public IEntityLivingData onInitialSpawn( DifficultyInstance difficulty, IEntityLivingData livingdata)`
- `protected void entityInit()`
- `protected ResourceLocation getLootTable()`
- `public AxisAlignedBB getRenderBoundingBox()`
- `public void onLivingUpdate()`
- `public Vec3d [] getRenderLocations(float p_193098_1_)`
- `public boolean isOnSameTeam( Entity entityIn)`
- `protected SoundEvent getAmbientSound()`
- `protected SoundEvent getDeathSound()`
- `protected SoundEvent getHurtSound( DamageSource damageSourceIn)`
- `protected SoundEvent getSpellSound()`
- `public void attackEntityWithRangedAttack( EntityLivingBase target, float distanceFactor)`
- `protected EntityArrow createArrowEntity(float p_193097_1_)`
- `public boolean isAggressive()`
- `public void setSwingingArms(boolean swingingArms)`
- `public AbstractIllager.IllagerArmPose getArmPose()`