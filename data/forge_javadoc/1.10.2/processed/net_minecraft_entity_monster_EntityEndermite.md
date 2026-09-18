# EntityEndermite

## Class signature

```java
public class EntityEndermite extends EntityMob
```

## Constructors

- `public EntityEndermite( World worldIn)`

## Methods

- `protected void initEntityAI()`
- `public float getEyeHeight()`
- `protected void applyEntityAttributes()`
- `protected boolean canTriggerWalking()`
- `protected SoundEvent getAmbientSound()`
- `protected SoundEvent getHurtSound()`
- `protected SoundEvent getDeathSound()`
- `protected void playStepSound( BlockPos pos, Block blockIn)`
- `@Nullable protected ResourceLocation getLootTable()`
- `public static void registerFixesEndermite( DataFixer fixer)`
- `public void readEntityFromNBT( NBTTagCompound compound)`
- `public void writeEntityToNBT( NBTTagCompound compound)`
- `public void onUpdate()`
- `public double getYOffset()`
- `public boolean isSpawnedByPlayer()`
- `public void setSpawnedByPlayer(boolean spawnedByPlayer)`
- `public void onLivingUpdate()`
- `protected boolean isValidLightLevel()`
- `public boolean getCanSpawnHere()`
- `public EnumCreatureAttribute getCreatureAttribute()`