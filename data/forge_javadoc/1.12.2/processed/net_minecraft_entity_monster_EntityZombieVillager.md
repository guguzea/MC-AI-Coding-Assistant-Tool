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
- `@Deprecated public int getProfession()`
- `public static void registerFixesZombieVillager( DataFixer fixer)`
- `public void writeEntityToNBT( NBTTagCompound compound)`
- `public void readEntityFromNBT( NBTTagCompound compound)`
- `public IEntityLivingData onInitialSpawn( DifficultyInstance difficulty, IEntityLivingData livingdata)`
- `public void onUpdate()`
- `public boolean processInteract( EntityPlayer player, EnumHand hand)`
- `protected boolean canDespawn()`
- `public boolean isConverting()`
- `protected void startConverting(java.util.UUID conversionStarterIn, int conversionTimeIn)`
- `public void handleStatusUpdate(byte id)`
- `protected void finishConversion()`
- `protected int getConversionProgress()`
- `protected float getSoundPitch()`
- `public SoundEvent getAmbientSound()`
- `public SoundEvent getHurtSound( DamageSource damageSourceIn)`
- `public SoundEvent getDeathSound()`
- `public SoundEvent getStepSound()`
- `protected ResourceLocation getLootTable()`
- `protected ItemStack getSkullDrop()`
- `public void setForgeProfession( VillagerRegistry.VillagerProfession prof)`
- `public VillagerRegistry.VillagerProfession getForgeProfession()`
- `public void notifyDataManagerChange( DataParameter <?> key)`

## Description

Deprecated.