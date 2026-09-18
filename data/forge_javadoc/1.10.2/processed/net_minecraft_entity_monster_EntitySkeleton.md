# EntitySkeleton

## Class signature

```java
public class EntitySkeleton extends EntityMob implements IRangedAttackMob
```

## Constructors

- `public EntitySkeleton( World worldIn)`

## Methods

- `protected void initEntityAI()`
- `protected void applyEntityAttributes()`
- `protected void entityInit()`
- `protected SoundEvent getAmbientSound()`
- `protected SoundEvent getHurtSound()`
- `protected SoundEvent getDeathSound()`
- `protected void playStepSound( BlockPos pos, Block blockIn)`
- `public boolean attackEntityAsMob( Entity entityIn)`
- `public EnumCreatureAttribute getCreatureAttribute()`
- `public void onLivingUpdate()`
- `public void updateRidden()`
- `public void onDeath( DamageSource cause)`
- `@Nullable protected ResourceLocation getLootTable()`
- `protected void setEquipmentBasedOnDifficulty( DifficultyInstance difficulty)`
- `@Nullable public IEntityLivingData onInitialSpawn( DifficultyInstance difficulty, @Nullable IEntityLivingData livingdata)`
- `public void setCombatTask()`
- `public void attackEntityWithRangedAttack( EntityLivingBase target, float distanceFactor)`
- `public SkeletonType getSkeletonType()`
- `public void setSkeletonType( SkeletonType type)`
- `public static void registerFixesSkeleton( DataFixer fixer)`
- `public void readEntityFromNBT( NBTTagCompound compound)`
- `public void writeEntityToNBT( NBTTagCompound compound)`
- `public void setItemStackToSlot( EntityEquipmentSlot slotIn, @Nullable ItemStack stack)`
- `public float getEyeHeight()`
- `public double getYOffset()`
- `public boolean isSwingingArms()`
- `public void setSwingingArms(boolean swingingArms)`