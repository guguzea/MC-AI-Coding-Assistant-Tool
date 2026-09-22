---
title: "EntityHorse"
description: "public class EntityHorse extends EntityAnimal implements IInvBasic"
package: "net/minecraft/entity/passive"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/passive/EntityHorse.html"
sourceType: javadoc
---

# EntityHorse

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.EntityLiving → net.minecraft.entity.EntityCreature → net.minecraft.entity.EntityAgeable → net.minecraft.entity.passive.EntityAnimal → net.minecraft.entity.passive.EntityHorse

## Class signature

```java
public class EntityHorse extends EntityAnimal implements IInvBasic
```

## Constructors

- `EntityHorse(World worldIn)`

## Methods

- `boolean allowLeashing()`
- `protected void applyEntityAttributes()`
- `boolean attackEntityFrom(DamageSource source, float amount)` — Called when the entity is attacked.
- `boolean canBePushed()` — Returns true if this entity should push and be pushed by other entities when colliding.
- `boolean canCarryChest()` — Return true if the horse entity can carry a chest.
- `boolean canMateWith(EntityAnimal otherAnimal)` — Returns true if the mob is currently able to mate with the specified mob.
- `boolean canWearArmor()` — Return true if the horse entity can wear an armor
- `EntityAgeable createChild(EntityAgeable ageable)`
- `void dropChestItems()`
- `void dropChests()`
- `protected void entityInit()`
- `void fall(float distance, float damageMultiplier)`
- `boolean func_110239_cn()`
- `boolean func_110253_bW()`
- `protected void func_142017_o(float p_142017_1_)`
- `boolean func_175507_cI()`
- `protected java.lang.String getAngrySoundName()`
- `boolean getCanSpawnHere()` — Checks if the entity's current position is a valid location to spawn this entity.
- `protected EntityHorse getClosestHorse(Entity entityIn, double distance)`
- `protected java.lang.String getDeathSound()` — Returns the sound this mob makes on death.
- `protected Item getDropItem()`
- `float getEyeHeight()`
- `float getGrassEatingAmount(float p_110258_1_)`
- `boolean getHasReproduced()`
- `int getHorseArmorIndexSynced()` — Returns type of armor from DataWatcher (0 = iron, 1 = gold, 2 = diamond)
- `double getHorseJumpStrength()`
- `float getHorseSize()`
- `java.lang.String getHorseTexture()`
- `int getHorseType()` — Returns the horse type. 0 = Normal, 1 = Donkey, 2 = Mule, 3 = Undead Horse, 4 = Skeleton Horse
- `int getHorseVariant()`
- `protected java.lang.String getHurtSound()` — Returns the sound this mob makes when it is hurt.
- `protected java.lang.String getLivingSound()` — Returns the sound this mob makes while it's alive.
- `int getMaxSpawnedInChunk()` — Will return how many at most can spawn in a chunk at once.
- `int getMaxTemper()`
- `float getMouthOpennessAngle(float p_110201_1_)`
- `java.lang.String getName()` — Get the name of this object.
- `java.lang.String getOwnerId()` — Gets the horse's owner
- `float getRearingAmount(float p_110223_1_)`
- `protected float getSoundVolume()` — Returns the volume for the sounds this mob makes.
- `int getTalkInterval()` — Get number of ticks, at least during which the living entity will be silent.
- `int getTemper()`
- `int getTotalArmorValue()` — Returns the current armor value as determined by a call to InventoryPlayer.getTotalArmorValue
- `java.lang.String[] getVariantTexturePaths()`
- `void handleStatusUpdate(byte id)`
- `int increaseTemper(int p_110198_1_)`
- `boolean interact(EntityPlayer player)` — Called when a player interacts with a mob. e.g. gets milk from a cow, gets into the saddle on a pig.
- `boolean isAdultHorse()`
- `static boolean isArmorItem(Item p_146085_0_)` — Returns true if given item is horse armor
- `boolean isBreeding()`
- `boolean isBreedingItem(ItemStack stack)` — Checks if the parameter is an item which this animal can be fed to breed it (wheat, carrots or seeds depending on the animal type)
- `boolean isChested()`
- `boolean isEatingHaystack()`
- `boolean isHorseJumping()`
- `boolean isHorseSaddled()`
- `protected boolean isMovementBlocked()` — Dead and sleeping entities cannot move
- `boolean isOnLadder()` — returns true if this entity is by a ladder, false otherwise
- `boolean isRearing()`
- `boolean isSterile()` — Return true if the horse entity is sterile (Undead || Mule)
- `boolean isTame()`
- `boolean isUndead()` — Used to know if the horse can be leashed, if he can mate, or if we can interact with him
- `void makeHorseRearWithSound()`
- `void moveEntityWithHeading(float strafe, float forward)` — Moves the entity based on the specified heading.
- `void onDeath(DamageSource cause)` — Called when the mob's health reaches 0.
- `IEntityLivingData onInitialSpawn(DifficultyInstance difficulty, IEntityLivingData livingdata)` — Called only once on an entity when first time spawned, via egg, mob spawner, natural spawning etc, but not called when entity is reloaded from nbt.
- `void onInventoryChanged(InventoryBasic p_76316_1_)` — Called by InventoryBasic.onInventoryChanged() on a array that is never filled.
- `void onLivingUpdate()` — Called frequently so the entity can update its state every tick as required.
- `void onUpdate()` — Called to update the entity's position/logic.
- `void openGUI(EntityPlayer playerEntity)`
- `protected void playStepSound(BlockPos pos, Block blockIn)`
- `boolean prepareChunkForSpawn()`
- `void readEntityFromNBT(NBTTagCompound tagCompund)` — (abstract) Protected helper method to read subclass entity data from NBT.
- `boolean replaceItemInInventory(int inventorySlot, ItemStack itemStackIn)`
- `void setBreeding(boolean breeding)`
- `void setChested(boolean chested)`
- `void setEating(boolean eating)`
- `void setEatingHaystack(boolean p_110227_1_)`
- `void setHasReproduced(boolean hasReproducedIn)`
- `void setHorseArmorStack(ItemStack itemStackIn)` — Set horse armor stack (for example: new ItemStack(Items.iron_horse_armor))
- `void setHorseJumping(boolean jumping)`
- `void setHorseSaddled(boolean saddled)`
- `void setHorseTamed(boolean tamed)`
- `void setHorseType(int type)`
- `void setHorseVariant(int variant)`
- `void setJumpPower(int jumpPowerIn)`
- `void setOwnerId(java.lang.String id)`
- `void setRearing(boolean rearing)`
- `void setScaleForAge(boolean p_98054_1_)` — "Sets the scale for an ageable entity according to the boolean parameter, which says if it's a child."
- `boolean setTamedBy(EntityPlayer player)`
- `void setTemper(int temperIn)`
- `protected void spawnHorseParticles(boolean p_110216_1_)` — "Spawns particles for the horse entity. par1 tells whether to spawn hearts.
- `void updateRiderPosition()`
- `void writeEntityToNBT(NBTTagCompound tagCompound)` — (abstract) Protected helper method to write subclass entity data to NBT.

## Fields

- `int field_110278_bp`
- `int field_110279_bq`
- `protected boolean horseJumping`
- `protected float jumpPower`
- `protected int temper` — "The higher this value, the more likely the horse is to be tamed next time a player rides it."
