# EntityVindicator

## Class signature

```java
public class EntityVindicator extends EntityMob
```

## Constructors

- `public EntityVindicator( World worldIn)`

## Methods

- `public static void registerFixesVindicator( DataFixer fixer)`
- `protected void initEntityAI()`
- `protected void applyEntityAttributes()`
- `protected void entityInit()`
- `public EnumCreatureAttribute getCreatureAttribute()`
- `protected ResourceLocation getLootTable()`
- `public void setAggressive(boolean p_190636_1_)`
- `public boolean isAggressive()`
- `public void writeEntityToNBT( NBTTagCompound compound)`
- `public void readEntityFromNBT( NBTTagCompound compound)`
- `@Nullable public IEntityLivingData onInitialSpawn( DifficultyInstance difficulty, @Nullable IEntityLivingData livingdata)`
- `protected void setEquipmentBasedOnDifficulty( DifficultyInstance difficulty)`
- `protected void updateAITasks()`
- `public boolean isOnSameTeam( Entity entityIn)`
- `public void setCustomNameTag(java.lang.String name)`
- `protected SoundEvent getAmbientSound()`
- `protected SoundEvent getDeathSound()`
- `protected SoundEvent getHurtSound()`