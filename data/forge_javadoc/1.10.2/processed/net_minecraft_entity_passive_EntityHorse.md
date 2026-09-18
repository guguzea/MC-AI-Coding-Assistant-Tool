# EntityHorse

## Class signature

```java
public class EntityHorse extends EntityAnimal implements IInventoryChangedListener , IJumpingMount
```

## Constructors

- `public EntityHorse( World worldIn)`

## Methods

- `protected void initEntityAI()`
- `protected void entityInit()`
- `public void setType( HorseType armorType)`
- `public HorseType getType()`
- `public void setHorseVariant(int variant)`
- `public int getHorseVariant()`
- `public java.lang.String getName()`
- `public boolean isAdultHorse()`
- `public boolean isTame()`
- `public boolean isRidable()`
- `@Nullable public java.util.UUID getOwnerUniqueId()`
- `public void setOwnerUniqueId(@Nullable java.util.UUID uniqueId)`
- `public float getHorseSize()`
- `public void setScaleForAge(boolean child)`
- `public boolean isHorseJumping()`
- `public void setHorseTamed(boolean tamed)`
- `public void setHorseJumping(boolean jumping)`
- `public boolean canBeLeashedTo( EntityPlayer player)`
- `protected void onLeashDistance(float p_142017_1_)`
- `public boolean isChested()`
- `public HorseArmorType getHorseArmorType()`
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
- `public boolean canBePushed()`
- `public boolean prepareChunkForSpawn()`
- `public void dropChests()`
- `public void fall(float distance, float damageMultiplier)`
- `public void onInventoryChanged( InventoryBasic invBasic)`
- `public boolean getCanSpawnHere()`
- `protected EntityHorse getClosestHorse( Entity entityIn, double distance)`
- `public double getHorseJumpStrength()`
- `protected SoundEvent getDeathSound()`
- `protected SoundEvent getHurtSound()`
- `public boolean isHorseSaddled()`
- `protected SoundEvent getAmbientSound()`
- `@Nullable protected SoundEvent getAngrySound()`
- `protected void playStepSound( BlockPos pos, Block blockIn)`
- `protected void applyEntityAttributes()`
- `public int getMaxSpawnedInChunk()`
- `public int getMaxTemper()`
- `protected float getSoundVolume()`
- `public int getTalkInterval()`
- `public boolean hasLayeredTextures()`
- `public boolean hasTexture()`
- `public java.lang.String getHorseTexture()`
- `public java.lang.String[] getVariantTexturePaths()`
- `public void openGUI( EntityPlayer playerEntity)`
- `public boolean processInteract( EntityPlayer player, EnumHand hand, @Nullable ItemStack stack)`
- `protected boolean isMovementBlocked()`
- `public boolean isBreedingItem(@Nullable ItemStack stack)`
- `public void onDeath( DamageSource cause)`
- `public void onLivingUpdate()`
- `public void onUpdate()`
- `public void setEatingHaystack(boolean p_110227_1_)`
- `public void setRearing(boolean rearing)`
- `public void makeHorseRearWithSound()`
- `public void dropChestItems()`
- `public boolean setTamedBy( EntityPlayer player)`
- `public void moveEntityWithHeading(float strafe, float forward)`
- `public static void registerFixesHorse( DataFixer fixer)`
- `public void writeEntityToNBT( NBTTagCompound compound)`
- `public void readEntityFromNBT( NBTTagCompound compound)`
- `public boolean canMateWith( EntityAnimal otherAnimal)`
- `public EntityAgeable createChild( EntityAgeable ageable)`
- `@Nullable public IEntityLivingData onInitialSpawn( DifficultyInstance difficulty, @Nullable IEntityLivingData livingdata)`
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
- `public double getMountedYOffset()`
- `public boolean isSkeletonTrap()`
- `public void setSkeletonTrap(boolean skeletonTrapIn)`
- `public boolean isOnLadder()`
- `public float getEyeHeight()`
- `public boolean replaceItemInInventory(int inventorySlot, @Nullable ItemStack itemStackIn)`
- `@Nullable public Entity getControllingPassenger()`
- `public EnumCreatureAttribute getCreatureAttribute()`
- `@Nullable protected ResourceLocation getLootTable()`
- `public <T> T getCapability( Capability <T> capability, EnumFacing facing)`
- `public boolean hasCapability( Capability <?> capability, EnumFacing facing)`

## Description

Retrieves the handler for the capability requested on the specific side.