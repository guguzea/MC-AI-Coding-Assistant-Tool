# EntityWitch

## Class signature

```java
public class EntityWitch extends EntityMob implements IRangedAttackMob
```

## Constructors

- `public EntityWitch( World worldIn)`

## Methods

- `public static void registerFixesWitch( DataFixer fixer)`
- `protected void initEntityAI()`
- `protected void entityInit()`
- `protected SoundEvent getAmbientSound()`
- `protected SoundEvent getHurtSound()`
- `protected SoundEvent getDeathSound()`
- `public void setAggressive(boolean aggressive)`
- `public boolean isDrinkingPotion()`
- `protected void applyEntityAttributes()`
- `public void onLivingUpdate()`
- `public void handleStatusUpdate(byte id)`
- `protected float applyPotionDamageCalculations( DamageSource source, float damage)`
- `@Nullable protected ResourceLocation getLootTable()`
- `public void attackEntityWithRangedAttack( EntityLivingBase target, float distanceFactor)`
- `public float getEyeHeight()`