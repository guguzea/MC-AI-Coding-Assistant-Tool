# EntityZombie

## Class signature

```java
public class EntityZombie extends EntityMob
```

## Constructors

- `public EntityZombie( World worldIn)`

## Methods

- `protected void initEntityAI()`
- `protected void applyEntityAI()`
- `protected void applyEntityAttributes()`
- `protected void entityInit()`
- `public void setArmsRaised(boolean armsRaised)`
- `public boolean isArmsRaised()`
- `public boolean isBreakDoorsTaskSet()`
- `public void setBreakDoorsAItask(boolean enabled)`
- `public boolean isChild()`
- `protected int getExperiencePoints( EntityPlayer player)`
- `public void setChild(boolean childZombie)`
- `@Deprecated @Nullable public ZombieType getZombieType()`
- `public boolean isVillager()`
- `@Nullable public VillagerRegistry.VillagerProfession getVillagerTypeForge()`
- `@Deprecated public void setZombieType( ZombieType type)`
- `public void setVillagerType(@Nullable VillagerRegistry.VillagerProfession type)`
- `public void notifyDataManagerChange( DataParameter <?> key)`
- `public void onLivingUpdate()`
- `public boolean attackEntityFrom( DamageSource source, float amount)`
- `public void onUpdate()`
- `public boolean attackEntityAsMob( Entity entityIn)`
- `protected SoundEvent getAmbientSound()`
- `protected SoundEvent getHurtSound()`
- `protected SoundEvent getDeathSound()`
- `protected void playStepSound( BlockPos pos, Block blockIn)`
- `public EnumCreatureAttribute getCreatureAttribute()`
- `@Nullable protected ResourceLocation getLootTable()`
- `protected void setEquipmentBasedOnDifficulty( DifficultyInstance difficulty)`
- `public static void registerFixesZombie( DataFixer fixer)`
- `public void writeEntityToNBT( NBTTagCompound compound)`
- `public void readEntityFromNBT( NBTTagCompound compound)`
- `public void onKillEntity( EntityLivingBase entityLivingIn)`
- `public float getEyeHeight()`
- `protected boolean canEquipItem( ItemStack stack)`
- `@Nullable public IEntityLivingData onInitialSpawn( DifficultyInstance difficulty, @Nullable IEntityLivingData livingdata)`
- `public boolean processInteract( EntityPlayer player, EnumHand hand, @Nullable ItemStack stack)`
- `protected void startConversion(int ticks)`
- `public void handleStatusUpdate(byte id)`
- `protected boolean canDespawn()`
- `public boolean isConverting()`
- `protected void convertToVillager()`
- `protected int getConversionTimeBoost()`
- `public void setChildSize(boolean isChild)`
- `protected final void setSize(float width, float height)`
- `protected final void multiplySize(float size)`
- `public double getYOffset()`
- `public void onDeath( DamageSource cause)`
- `public java.lang.String getName()`

## Description

Deprecated.