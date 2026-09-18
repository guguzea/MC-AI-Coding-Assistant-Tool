# EntityVindicator

## Class signature

```java
public class EntityVindicator extends AbstractIllager
```

## Constructors

- `public EntityVindicator( World worldIn)`

## Methods

- `public static void registerFixesVindicator( DataFixer fixer)`
- `protected void initEntityAI()`
- `protected void applyEntityAttributes()`
- `protected void entityInit()`
- `protected ResourceLocation getLootTable()`
- `public boolean isAggressive()`
- `public void setAggressive(boolean p_190636_1_)`
- `public void writeEntityToNBT( NBTTagCompound compound)`
- `public AbstractIllager.IllagerArmPose getArmPose()`
- `public void readEntityFromNBT( NBTTagCompound compound)`
- `public IEntityLivingData onInitialSpawn( DifficultyInstance difficulty, IEntityLivingData livingdata)`
- `protected void setEquipmentBasedOnDifficulty( DifficultyInstance difficulty)`
- `protected void updateAITasks()`
- `public boolean isOnSameTeam( Entity entityIn)`
- `public void setCustomNameTag(java.lang.String name)`
- `protected SoundEvent getAmbientSound()`
- `protected SoundEvent getDeathSound()`
- `protected SoundEvent getHurtSound( DamageSource damageSourceIn)`