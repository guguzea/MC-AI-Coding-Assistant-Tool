# EntityEvoker

## Class signature

```java
public class EntityEvoker extends EntitySpellcasterIllager
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
- `protected ResourceLocation getLootTable()`
- `protected void updateAITasks()`
- `public void onUpdate()`
- `public boolean isOnSameTeam( Entity entityIn)`
- `protected SoundEvent getAmbientSound()`
- `protected SoundEvent getDeathSound()`
- `protected SoundEvent getHurtSound( DamageSource damageSourceIn)`
- `protected SoundEvent getSpellSound()`