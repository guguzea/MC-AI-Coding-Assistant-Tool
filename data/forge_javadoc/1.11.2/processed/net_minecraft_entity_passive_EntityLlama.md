# EntityLlama

## Class signature

```java
public class EntityLlama extends AbstractChestHorse implements IRangedAttackMob
```

## Constructors

- `public EntityLlama( World worldIn)`

## Methods

- `public int getStrength()`
- `public void writeEntityToNBT( NBTTagCompound compound)`
- `public void readEntityFromNBT( NBTTagCompound compound)`
- `protected void initEntityAI()`
- `protected void applyEntityAttributes()`
- `protected void entityInit()`
- `public int getVariant()`
- `public void setVariant(int variantIn)`
- `protected int getInventorySize()`
- `public void updatePassenger( Entity passenger)`
- `public double getMountedYOffset()`
- `public boolean canBeSteered()`
- `protected boolean handleEating( EntityPlayer player, ItemStack stack)`
- `protected boolean isMovementBlocked()`
- `@Nullable public IEntityLivingData onInitialSpawn( DifficultyInstance difficulty, @Nullable IEntityLivingData livingdata)`
- `public boolean hasColor()`
- `protected SoundEvent getAngrySound()`
- `protected SoundEvent getAmbientSound()`
- `protected SoundEvent getHurtSound()`
- `protected SoundEvent getDeathSound()`
- `protected void playStepSound( BlockPos pos, Block blockIn)`
- `protected void playChestEquipSound()`
- `public void makeMad()`
- `@Nullable protected ResourceLocation getLootTable()`
- `public int getInventoryColumns()`
- `public boolean wearsArmor()`
- `public boolean isArmor( ItemStack stack)`
- `public boolean canBeSaddled()`
- `public void onInventoryChanged( IInventory invBasic)`
- `protected void updateHorseSlots()`
- `@Nullable public EnumDyeColor getColor()`
- `public int getMaxTemper()`
- `public boolean canMateWith( EntityAnimal otherAnimal)`
- `public EntityLlama createChild( EntityAgeable ageable)`
- `public void fall(float distance, float damageMultiplier)`
- `public void leaveCaravan()`
- `public void joinCaravan( EntityLlama caravanHeadIn)`
- `public boolean hasCaravanTrail()`
- `public boolean inCaravan()`
- `@Nullable public EntityLlama getCaravanHead()`
- `protected double followLeashSpeed()`
- `protected void followMother()`
- `public boolean canEatGrass()`
- `public void attackEntityWithRangedAttack( EntityLivingBase target, float distanceFactor)`