---
title: "EntityHorse"
description: "public class EntityHorse extends EntityAnimal implements IInventoryChangedListener, IJumpingMount"
package: "net/minecraft/entity/passive"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/entity/passive/EntityHorse.html"
sourceType: javadoc
---

# EntityHorse

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.EntityLiving → net.minecraft.entity.EntityCreature → net.minecraft.entity.EntityAgeable → net.minecraft.entity.passive.EntityAnimal → net.minecraft.entity.passive.EntityHorse

## Class signature

```java
public class EntityHorse extends EntityAnimal implements IInventoryChangedListener, IJumpingMount
```

## Constructors

- `EntityHorse(World worldIn)`

## Methods

- `protected void applyEntityAttributes()`
- `boolean attackEntityFrom(DamageSource source, float amount)`
- `boolean canBeLeashedTo(EntityPlayer player)`
- `boolean canBePushed()`
- `boolean canBeSteered()`
- `boolean canJump()`
- `boolean canMateWith(EntityAnimal otherAnimal)`
- `EntityAgeable createChild(EntityAgeable ageable)`
- `void dropChestItems()`
- `void dropChests()`
- `protected void entityInit()`
- `void fall(float distance, float damageMultiplier)`
- `protected SoundEvent getAmbientSound()`
- `protected SoundEvent getAngrySound()`
- `boolean getCanSpawnHere()`
- `<T> T getCapability(Capability<T> capability, EnumFacing facing)` — Retrieves the handler for the capability requested on the specific side.
- `protected EntityHorse getClosestHorse(Entity entityIn, double distance)`
- `Entity getControllingPassenger()`
- `EnumCreatureAttribute getCreatureAttribute()`
- `protected SoundEvent getDeathSound()`
- `float getEyeHeight()`
- `float getGrassEatingAmount(float p_110258_1_)`
- `boolean getHasReproduced()`
- `HorseArmorType getHorseArmorType()`
- `double getHorseJumpStrength()`
- `float getHorseSize()`
- `java.lang.String getHorseTexture()`
- `int getHorseVariant()`
- `protected SoundEvent getHurtSound()`
- `protected ResourceLocation getLootTable()`
- `int getMaxSpawnedInChunk()`
- `int getMaxTemper()`
- `double getMountedYOffset()`
- `float getMouthOpennessAngle(float p_110201_1_)`
- `java.lang.String getName()`
- `java.util.UUID getOwnerUniqueId()`
- `float getRearingAmount(float p_110223_1_)`
- `protected float getSoundVolume()`
- `int getTalkInterval()`
- `int getTemper()`
- `HorseType getType()`
- `java.lang.String[] getVariantTexturePaths()`
- `void handleStartJump(int p_184775_1_)`
- `void handleStatusUpdate(byte id)`
- `void handleStopJump()`
- `boolean hasCapability(Capability<?> capability, EnumFacing facing)` — Determines if this object has support for the capability in question on the specific side.
- `boolean hasLayeredTextures()`
- `boolean hasTexture()`
- `int increaseTemper(int p_110198_1_)`
- `protected void initEntityAI()`
- `boolean isAdultHorse()`
- `boolean isBreeding()`
- `boolean isBreedingItem(ItemStack stack)`
- `boolean isChested()`
- `boolean isEatingHaystack()`
- `boolean isHorseJumping()`
- `boolean isHorseSaddled()`
- `protected boolean isMovementBlocked()`
- `boolean isOnLadder()`
- `boolean isRearing()`
- `boolean isRidable()`
- `boolean isSkeletonTrap()`
- `boolean isTame()`
- `void makeHorseRearWithSound()`
- `void moveEntityWithHeading(float strafe, float forward)`
- `void onDeath(DamageSource cause)`
- `IEntityLivingData onInitialSpawn(DifficultyInstance difficulty, IEntityLivingData livingdata)`
- `void onInventoryChanged(InventoryBasic invBasic)`
- `protected void onLeashDistance(float p_142017_1_)`
- `void onLivingUpdate()`
- `void onUpdate()`
- `void openGUI(EntityPlayer playerEntity)`
- `protected void playStepSound(BlockPos pos, Block blockIn)`
- `boolean prepareChunkForSpawn()`
- `boolean processInteract(EntityPlayer player, EnumHand hand, ItemStack stack)`
- `void readEntityFromNBT(NBTTagCompound compound)`
- `static void registerFixesHorse(DataFixer fixer)`
- `boolean replaceItemInInventory(int inventorySlot, ItemStack itemStackIn)`
- `void setBreeding(boolean breeding)`
- `void setChested(boolean chested)`
- `void setEatingHaystack(boolean p_110227_1_)`
- `void setHasReproduced(boolean hasReproducedIn)`
- `void setHorseArmorStack(ItemStack itemStackIn)`
- `void setHorseJumping(boolean jumping)`
- `void setHorseSaddled(boolean saddled)`
- `void setHorseTamed(boolean tamed)`
- `void setHorseVariant(int variant)`
- `void setJumpPower(int jumpPowerIn)`
- `void setOwnerUniqueId(java.util.UUID uniqueId)`
- `void setRearing(boolean rearing)`
- `void setScaleForAge(boolean child)`
- `void setSkeletonTrap(boolean skeletonTrapIn)`
- `boolean setTamedBy(EntityPlayer player)`
- `void setTemper(int temperIn)`
- `void setType(HorseType armorType)`
- `protected void spawnHorseParticles(boolean p_110216_1_)`
- `void updatePassenger(Entity passenger)`
- `void writeEntityToNBT(NBTTagCompound compound)`

## Fields

- `protected boolean horseJumping`
- `protected float jumpPower`
- `int sprintCounter`
- `int tailCounter`
- `protected int temper`
