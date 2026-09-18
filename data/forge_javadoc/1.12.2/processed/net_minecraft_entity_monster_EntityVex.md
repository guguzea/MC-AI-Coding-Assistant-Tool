# EntityVex

## Class signature

```java
public class EntityVex extends EntityMob
```

## Constructors

- `public EntityVex( World worldIn)`

## Methods

- `public void move( MoverType type, double x, double y, double z)`
- `public void onUpdate()`
- `protected void initEntityAI()`
- `protected void applyEntityAttributes()`
- `protected void entityInit()`
- `public static void registerFixesVex( DataFixer fixer)`
- `public void readEntityFromNBT( NBTTagCompound compound)`
- `public void writeEntityToNBT( NBTTagCompound compound)`
- `public EntityLiving getOwner()`
- `public BlockPos getBoundOrigin()`
- `public void setBoundOrigin( BlockPos boundOriginIn)`
- `public boolean isCharging()`
- `public void setCharging(boolean charging)`
- `public void setOwner( EntityLiving ownerIn)`
- `public void setLimitedLife(int limitedLifeTicksIn)`
- `protected SoundEvent getAmbientSound()`
- `protected SoundEvent getDeathSound()`
- `protected SoundEvent getHurtSound( DamageSource damageSourceIn)`
- `protected ResourceLocation getLootTable()`
- `public int getBrightnessForRender()`
- `public float getBrightness()`
- `public IEntityLivingData onInitialSpawn( DifficultyInstance difficulty, IEntityLivingData livingdata)`
- `protected void setEquipmentBasedOnDifficulty( DifficultyInstance difficulty)`