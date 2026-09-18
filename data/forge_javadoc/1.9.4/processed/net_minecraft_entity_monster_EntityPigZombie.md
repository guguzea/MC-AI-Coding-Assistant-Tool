# EntityPigZombie

## Class signature

```java
public class EntityPigZombie extends EntityZombie
```

## Constructors

- `public EntityPigZombie( World worldIn)`

## Methods

- `public void setRevengeTarget(@Nullable EntityLivingBase livingBase)`
- `protected void applyEntityAI()`
- `protected void applyEntityAttributes()`
- `public void onUpdate()`
- `protected void updateAITasks()`
- `public boolean getCanSpawnHere()`
- `public boolean isNotColliding()`
- `public void writeEntityToNBT( NBTTagCompound compound)`
- `public void readEntityFromNBT( NBTTagCompound compound)`
- `public boolean attackEntityFrom( DamageSource source, float amount)`
- `public boolean isAngry()`
- `protected SoundEvent getAmbientSound()`
- `protected SoundEvent getHurtSound()`
- `protected SoundEvent getDeathSound()`
- `@Nullable protected ResourceLocation getLootTable()`
- `public boolean processInteract( EntityPlayer player, EnumHand hand, @Nullable ItemStack stack)`
- `protected void setEquipmentBasedOnDifficulty( DifficultyInstance difficulty)`
- `@Nullable public IEntityLivingData onInitialSpawn( DifficultyInstance difficulty, @Nullable IEntityLivingData livingdata)`