# EntityEnderman

## Class signature

```java
public class EntityEnderman extends EntityMob
```

## Constructors

- `public EntityEnderman( World worldIn)`

## Methods

- `protected void initEntityAI()`
- `protected void applyEntityAttributes()`
- `public void setAttackTarget( EntityLivingBase entitylivingbaseIn)`
- `protected void entityInit()`
- `public void playEndermanSound()`
- `public void notifyDataManagerChange( DataParameter <?> key)`
- `public static void registerFixesEnderman( DataFixer fixer)`
- `public void writeEntityToNBT( NBTTagCompound compound)`
- `public void readEntityFromNBT( NBTTagCompound compound)`
- `public float getEyeHeight()`
- `public void onLivingUpdate()`
- `protected void updateAITasks()`
- `protected boolean teleportRandomly()`
- `protected boolean teleportToEntity( Entity p_70816_1_)`
- `protected SoundEvent getAmbientSound()`
- `protected SoundEvent getHurtSound( DamageSource damageSourceIn)`
- `protected SoundEvent getDeathSound()`
- `protected void dropEquipment(boolean wasRecentlyHit, int lootingModifier)`
- `protected ResourceLocation getLootTable()`
- `public void setHeldBlockState( IBlockState state)`
- `public IBlockState getHeldBlockState()`
- `public boolean attackEntityFrom( DamageSource source, float amount)`
- `public static void setCarriable( Block block, boolean canCarry)`
- `public static boolean getCarriable( Block block)`
- `public boolean isScreaming()`