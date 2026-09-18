---
title: "AbstractHorse"
description: "Retrieves the handler for the capability requested on the specific side."
package: "net/minecraft/entity/passive"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/entity/passive/AbstractHorse.html"
sourceType: javadoc
---

# AbstractHorse

## Class signature

```java
public abstract class AbstractHorse extends EntityAnimal implements IInventoryChangedListener , IJumpingMount
```

## Constructors

- `public AbstractHorse( World worldIn)`

## Methods

- `protected void initEntityAI()`
- `protected void entityInit()`
- `protected boolean getHorseWatchableBoolean(int p_110233_1_)`
- `protected void setHorseWatchableBoolean(int p_110208_1_, boolean p_110208_2_)`
- `public boolean isTame()`
- `@Nullable public java.util.UUID getOwnerUniqueId()`
- `public void setOwnerUniqueId(@Nullable java.util.UUID uniqueId)`
- `public float getHorseSize()`
- `public void setScaleForAge(boolean child)`
- `public boolean isHorseJumping()`
- `public void setHorseTamed(boolean tamed)`
- `public void setHorseJumping(boolean jumping)`
- `public boolean canBeLeashedTo( EntityPlayer player)`
- `protected void onLeashDistance(float p_142017_1_)`
- `public boolean isEatingHaystack()`
- `public boolean isRearing()`
- `public boolean isBreeding()`
- `public void setBreeding(boolean breeding)`
- `public void setHorseSaddled(boolean saddled)`
- `public int getTemper()`
- `public void setTemper(int temperIn)`
- `public int increaseTemper(int p_110198_1_)`
- `public boolean attackEntityFrom( DamageSource source, float amount)`
- `public boolean canBePushed()`
- `public void fall(float distance, float damageMultiplier)`
- `protected int getInventorySize()`
- `protected void initHorseChest()`
- `protected void updateHorseSlots()`
- `public void onInventoryChanged( IInventory invBasic)`
- `@Nullable protected AbstractHorse getClosestHorse( Entity entityIn, double distance)`
- `public double getHorseJumpStrength()`
- `@Nullable protected SoundEvent getDeathSound()`
- `@Nullable protected SoundEvent getHurtSound()`
- `@Nullable protected SoundEvent getAmbientSound()`
- `public boolean canBeSaddled()`
- `public boolean isHorseSaddled()`
- `@Nullable protected SoundEvent getAngrySound()`
- `protected void playStepSound( BlockPos pos, Block blockIn)`
- `protected void playGallopSound( SoundType p_190680_1_)`
- `protected void applyEntityAttributes()`
- `public int getMaxSpawnedInChunk()`
- `public int getMaxTemper()`
- `protected float getSoundVolume()`
- `public int getTalkInterval()`
- `public void openGUI( EntityPlayer playerEntity)`
- `protected boolean handleEating( EntityPlayer player, ItemStack stack)`
- `protected void mountTo( EntityPlayer player)`
- `protected boolean isMovementBlocked()`
- `public boolean isBreedingItem( ItemStack stack)`
- `public void onDeath( DamageSource cause)`
- `public void onLivingUpdate()`
- `protected void followMother()`
- `public boolean canEatGrass()`
- `public void onUpdate()`
- `public void setEatingHaystack(boolean p_110227_1_)`
- `public void setRearing(boolean rearing)`
- `public void makeMad()`
- `public boolean setTamedBy( EntityPlayer player)`
- `public void moveEntityWithHeading(float strafe, float forward)`
- `public static void registerFixesAbstractHorse( DataFixer fixer, java.lang.Class<?> entityClass)`
- `public void writeEntityToNBT( NBTTagCompound compound)`
- `public void readEntityFromNBT( NBTTagCompound compound)`
- `public boolean canMateWith( EntityAnimal otherAnimal)`
- `protected boolean canMate()`
- `@Nullable public EntityAgeable createChild( EntityAgeable ageable)`
- `protected void setOffspringAttributes( EntityAgeable p_190681_1_, AbstractHorse p_190681_2_)`
- `public boolean canBeSteered()`
- `public float getGrassEatingAmount(float p_110258_1_)`
- `public float getRearingAmount(float p_110223_1_)`
- `public float getMouthOpennessAngle(float p_110201_1_)`
- `public void setJumpPower(int jumpPowerIn)`
- `public boolean canJump()`
- `public void handleStartJump(int p_184775_1_)`
- `public void handleStopJump()`
- `protected void spawnHorseParticles(boolean p_110216_1_)`
- `public void handleStatusUpdate(byte id)`
- `public void updatePassenger( Entity passenger)`
- `protected float getModifiedMaxHealth()`
- `protected double getModifiedJumpStrength()`
- `protected double getModifiedMovementSpeed()`
- `public boolean isOnLadder()`
- `public float getEyeHeight()`
- `public boolean wearsArmor()`
- `public boolean isArmor( ItemStack stack)`
- `public boolean replaceItemInInventory(int inventorySlot, ItemStack itemStackIn)`
- `@Nullable public Entity getControllingPassenger()`
- `@Nullable public IEntityLivingData onInitialSpawn( DifficultyInstance difficulty, @Nullable IEntityLivingData livingdata)`
- `@Nullable public <T> T getCapability( Capability <T> capability, @Nullable EnumFacing facing)`
- `public boolean hasCapability( Capability <?> capability, @Nullable EnumFacing facing)`

## Description

Retrieves the handler for the capability requested on the specific side.
