# EntityOcelot

## Class signature

```java
public class EntityOcelot extends EntityTameable
```

## Constructors

- `public EntityOcelot( World worldIn)`

## Methods

- `protected void initEntityAI()`
- `protected void entityInit()`
- `public void updateAITasks()`
- `protected boolean canDespawn()`
- `protected void applyEntityAttributes()`
- `public void fall(float distance, float damageMultiplier)`
- `public static void registerFixesOcelot( DataFixer fixer)`
- `public void writeEntityToNBT( NBTTagCompound compound)`
- `public void readEntityFromNBT( NBTTagCompound compound)`
- `@Nullable protected SoundEvent getAmbientSound()`
- `protected SoundEvent getHurtSound()`
- `protected SoundEvent getDeathSound()`
- `protected float getSoundVolume()`
- `public boolean attackEntityAsMob( Entity entityIn)`
- `public boolean attackEntityFrom( DamageSource source, float amount)`
- `@Nullable protected ResourceLocation getLootTable()`
- `public boolean processInteract( EntityPlayer player, EnumHand hand)`
- `public EntityOcelot createChild( EntityAgeable ageable)`
- `public boolean isBreedingItem( ItemStack stack)`
- `public boolean canMateWith( EntityAnimal otherAnimal)`
- `public int getTameSkin()`
- `public void setTameSkin(int skinId)`
- `public boolean getCanSpawnHere()`
- `public boolean isNotColliding()`
- `public java.lang.String getName()`
- `protected void setupTamedAI()`
- `@Nullable public IEntityLivingData onInitialSpawn( DifficultyInstance difficulty, @Nullable IEntityLivingData livingdata)`