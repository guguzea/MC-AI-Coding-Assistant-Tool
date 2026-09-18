# EntityEvoker

## Class signature

```java
public class EntityEvoker extends EntityMob
```

## Constructors

- `public EntityEvoker( World worldIn)`

## Methods

- `protected void initEntityAI()`
- `protected void applyEntityAttributes()`
- `protected void entityInit()`
- `public static void registerFixesEvoker( DataFixer fixer)`
- `public void readEntityFromNBT( NBTTagCompound compound)`
- `public void writeEntityToNBT( NBTTagCompound compound)`
- `public EnumCreatureAttribute getCreatureAttribute()`
- `protected ResourceLocation getLootTable()`
- `public boolean isCastingSpell()`
- `public void setIsCastingSpell(int p_190753_1_)`
- `protected void updateAITasks()`
- `public void onUpdate()`
- `public boolean isOnSameTeam( Entity entityIn)`
- `protected SoundEvent getAmbientSound()`
- `protected SoundEvent getDeathSound()`
- `protected SoundEvent getHurtSound()`