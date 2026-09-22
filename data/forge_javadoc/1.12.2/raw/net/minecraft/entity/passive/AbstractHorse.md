---
title: "AbstractHorse"
description: "public abstract class AbstractHorse extends EntityAnimal implements IInventoryChangedListener, IJumpingMount"
package: "net/minecraft/entity/passive"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/entity/passive/AbstractHorse.html"
sourceType: javadoc
---

# AbstractHorse

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.EntityLiving → net.minecraft.entity.EntityCreature → net.minecraft.entity.EntityAgeable → net.minecraft.entity.passive.EntityAnimal → net.minecraft.entity.passive.AbstractHorse

## Class signature

```java
public abstract class AbstractHorse extends EntityAnimal implements IInventoryChangedListener, IJumpingMount
```

## Constructors

- `AbstractHorse(World worldIn)`

## Methods

- `protected void applyEntityAttributes()`
- `boolean attackEntityFrom(DamageSource source, float amount)`
- `boolean canBeLeashedTo(EntityPlayer player)`
- `boolean canBePushed()`
- `boolean canBeSaddled()`
- `boolean canBeSteered()`
- `boolean canEatGrass()`
- `boolean canJump()`
- `protected boolean canMate()`
- `boolean canMateWith(EntityAnimal otherAnimal)`
- `EntityAgeable createChild(EntityAgeable ageable)`
- `protected void entityInit()`
- `void fall(float distance, float damageMultiplier)`
- `protected void followMother()`
- `protected SoundEvent getAmbientSound()`
- `protected SoundEvent getAngrySound()`
- `<T> T getCapability(Capability<T> capability, EnumFacing facing)` — Retrieves the handler for the capability requested on the specific side.
- `protected AbstractHorse getClosestHorse(Entity entityIn, double distance)`
- `Entity getControllingPassenger()`
- `protected SoundEvent getDeathSound()`
- `float getEyeHeight()`
- `float getGrassEatingAmount(float p_110258_1_)`
- `double getHorseJumpStrength()`
- `float getHorseSize()`
- `protected boolean getHorseWatchableBoolean(int p_110233_1_)`
- `protected SoundEvent getHurtSound(DamageSource damageSourceIn)`
- `protected int getInventorySize()`
- `int getMaxSpawnedInChunk()`
- `int getMaxTemper()`
- `protected double getModifiedJumpStrength()`
- `protected float getModifiedMaxHealth()`
- `protected double getModifiedMovementSpeed()`
- `float getMouthOpennessAngle(float p_110201_1_)`
- `java.util.UUID getOwnerUniqueId()`
- `float getRearingAmount(float p_110223_1_)`
- `protected float getSoundVolume()`
- `int getTalkInterval()`
- `int getTemper()`
- `protected boolean handleEating(EntityPlayer player, ItemStack stack)`
- `void handleStartJump(int p_184775_1_)`
- `void handleStatusUpdate(byte id)`
- `void handleStopJump()`
- `boolean hasCapability(Capability<?> capability, EnumFacing facing)` — Determines if this object has support for the capability in question on the specific side.
- `int increaseTemper(int p_110198_1_)`
- `protected void initEntityAI()`
- `protected void initHorseChest()`
- `boolean isArmor(ItemStack stack)`
- `boolean isBreeding()`
- `boolean isBreedingItem(ItemStack stack)`
- `boolean isEatingHaystack()`
- `boolean isHorseJumping()`
- `boolean isHorseSaddled()`
- `protected boolean isMovementBlocked()`
- `boolean isOnLadder()`
- `boolean isRearing()`
- `boolean isTame()`
- `void makeMad()`
- `protected void mountTo(EntityPlayer player)`
- `void onDeath(DamageSource cause)`
- `IEntityLivingData onInitialSpawn(DifficultyInstance difficulty, IEntityLivingData livingdata)`
- `void onInventoryChanged(IInventory invBasic)`
- `protected void onLeashDistance(float p_142017_1_)`
- `void onLivingUpdate()`
- `void onUpdate()`
- `void openGUI(EntityPlayer playerEntity)`
- `protected void playGallopSound(SoundType p_190680_1_)`
- `protected void playStepSound(BlockPos pos, Block blockIn)`
- `void readEntityFromNBT(NBTTagCompound compound)`
- `static void registerFixesAbstractHorse(DataFixer fixer, java.lang.Class<?> entityClass)`
- `boolean replaceItemInInventory(int inventorySlot, ItemStack itemStackIn)`
- `void setBreeding(boolean breeding)`
- `void setEatingHaystack(boolean p_110227_1_)`
- `void setHorseJumping(boolean jumping)`
- `void setHorseSaddled(boolean saddled)`
- `void setHorseTamed(boolean tamed)`
- `protected void setHorseWatchableBoolean(int p_110208_1_, boolean p_110208_2_)`
- `void setJumpPower(int jumpPowerIn)`
- `protected void setOffspringAttributes(EntityAgeable p_190681_1_, AbstractHorse p_190681_2_)`
- `void setOwnerUniqueId(java.util.UUID uniqueId)`
- `void setRearing(boolean rearing)`
- `void setScaleForAge(boolean child)`
- `boolean setTamedBy(EntityPlayer player)`
- `void setTemper(int temperIn)`
- `protected void spawnHorseParticles(boolean p_110216_1_)`
- `void travel(float strafe, float vertical, float forward)`
- `protected void updateHorseSlots()`
- `void updatePassenger(Entity passenger)`
- `boolean wearsArmor()`
- `void writeEntityToNBT(NBTTagCompound compound)`

## Fields

- `protected boolean canGallop`
- `protected int gallopTime`
- `protected ContainerHorseChest horseChest`
- `protected boolean horseJumping`
- `protected static IAttribute JUMP_STRENGTH`
- `protected float jumpPower`
- `int sprintCounter`
- `int tailCounter`
- `protected int temper`
