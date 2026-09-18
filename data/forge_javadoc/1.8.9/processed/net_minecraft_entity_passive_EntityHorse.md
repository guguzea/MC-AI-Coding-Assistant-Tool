# EntityHorse

## Class signature

```java
public class EntityHorse extends EntityAnimal implements IInvBasic
```

## Constructors

- `public EntityHorse( World worldIn)`

## Methods

- `protected void entityInit()`
- `public void setHorseType(int type)`
- `public int getHorseType()`
- `public void setHorseVariant(int variant)`
- `public int getHorseVariant()`
- `public java.lang.String getName()`
- `public boolean isAdultHorse()`
- `public boolean isTame()`
- `public boolean func_110253_bW()`
- `public java.lang.String getOwnerId()`
- `public void setOwnerId(java.lang.String id)`
- `public float getHorseSize()`
- `public void setScaleForAge(boolean p_98054_1_)`
- `public boolean isHorseJumping()`
- `public void setHorseTamed(boolean tamed)`
- `public void setHorseJumping(boolean jumping)`
- `public boolean allowLeashing()`
- `protected void func_142017_o(float p_142017_1_)`
- `public boolean isChested()`
- `public int getHorseArmorIndexSynced()`
- `public boolean isEatingHaystack()`
- `public boolean isRearing()`
- `public boolean isBreeding()`
- `public boolean getHasReproduced()`
- `public void setHorseArmorStack( ItemStack itemStackIn)`
- `public void setBreeding(boolean breeding)`
- `public void setChested(boolean chested)`
- `public void setHasReproduced(boolean hasReproducedIn)`
- `public void setHorseSaddled(boolean saddled)`
- `public int getTemper()`
- `public void setTemper(int temperIn)`
- `public int increaseTemper(int p_110198_1_)`
- `public boolean attackEntityFrom( DamageSource source, float amount)`
- `public int getTotalArmorValue()`
- `public boolean canBePushed()`
- `public boolean prepareChunkForSpawn()`
- `public void dropChests()`
- `public void fall(float distance, float damageMultiplier)`
- `public void onInventoryChanged( InventoryBasic p_76316_1_)`
- `public boolean getCanSpawnHere()`
- `protected EntityHorse getClosestHorse( Entity entityIn, double distance)`
- `public double getHorseJumpStrength()`
- `protected java.lang.String getDeathSound()`
- `protected Item getDropItem()`
- `protected java.lang.String getHurtSound()`
- `public boolean isHorseSaddled()`
- `protected java.lang.String getLivingSound()`
- `protected java.lang.String getAngrySoundName()`
- `protected void playStepSound( BlockPos pos, Block blockIn)`
- `protected void applyEntityAttributes()`
- `public int getMaxSpawnedInChunk()`
- `public int getMaxTemper()`
- `protected float getSoundVolume()`
- `public int getTalkInterval()`
- `public boolean func_110239_cn()`
- `public boolean func_175507_cI()`
- `public java.lang.String getHorseTexture()`
- `public java.lang.String[] getVariantTexturePaths()`
- `public void openGUI( EntityPlayer playerEntity)`
- `public boolean interact( EntityPlayer player)`
- `public boolean canWearArmor()`
- `public boolean canCarryChest()`
- `protected boolean isMovementBlocked()`
- `public boolean isUndead()`
- `public boolean isSterile()`
- `public boolean isBreedingItem( ItemStack stack)`
- `public void onDeath( DamageSource cause)`
- `public void onLivingUpdate()`
- `public void onUpdate()`
- `public void setEating(boolean eating)`
- `public void setEatingHaystack(boolean p_110227_1_)`
- `public void setRearing(boolean rearing)`
- `public void makeHorseRearWithSound()`
- `public void dropChestItems()`
- `public boolean setTamedBy( EntityPlayer player)`
- `public void moveEntityWithHeading(float strafe, float forward)`
- `public void writeEntityToNBT( NBTTagCompound tagCompound)`
- `public void readEntityFromNBT( NBTTagCompound tagCompund)`
- `public boolean canMateWith( EntityAnimal otherAnimal)`
- `public EntityAgeable createChild( EntityAgeable ageable)`
- `public IEntityLivingData onInitialSpawn( DifficultyInstance difficulty, IEntityLivingData livingdata)`
- `public float getGrassEatingAmount(float p_110258_1_)`
- `public float getRearingAmount(float p_110223_1_)`
- `public float getMouthOpennessAngle(float p_110201_1_)`
- `public void setJumpPower(int jumpPowerIn)`
- `protected void spawnHorseParticles(boolean p_110216_1_)`
- `public void handleStatusUpdate(byte id)`
- `public void updateRiderPosition()`
- `public static boolean isArmorItem( Item p_146085_0_)`
- `public boolean isOnLadder()`
- `public float getEyeHeight()`
- `public boolean replaceItemInInventory(int inventorySlot, ItemStack itemStackIn)`

## Description

"The higher this value, the more likely the horse is to be tamed next time a player rides it."