# EntityZombieVillager

## Class signature

```java
public class EntityZombieVillager extends EntityZombie
```

## Constructors

- `public EntityZombieVillager( World worldIn)`

## Methods

- `protected void entityInit()`
- `public void setProfession(int profession)`
- `public int getProfession()`
- `public static void registerFixesZombieVillager( DataFixer fixer)`
- `public void writeEntityToNBT( NBTTagCompound compound)`
- `public void readEntityFromNBT( NBTTagCompound compound)`
- `@Nullable public IEntityLivingData onInitialSpawn( DifficultyInstance difficulty, @Nullable IEntityLivingData livingdata)`
- `public void setForgeProfession( VillagerRegistry.VillagerProfession prof)`
- `@Nullable public VillagerRegistry.VillagerProfession getForgeProfession()`
- `public void onUpdate()`
- `public boolean processInteract( EntityPlayer player, EnumHand hand)`
- `protected boolean canDespawn()`
- `public boolean isConverting()`
- `protected void startConverting(int p_190734_1_)`
- `public void handleStatusUpdate(byte id)`
- `protected void finishConversion()`
- `protected int getConversionProgress()`
- `protected float getSoundPitch()`
- `public SoundEvent getAmbientSound()`
- `public SoundEvent getHurtSound()`
- `public SoundEvent getDeathSound()`
- `public SoundEvent getStepSound()`
- `@Nullable protected ResourceLocation getLootTable()`
- `protected ItemStack getSkullDrop()`