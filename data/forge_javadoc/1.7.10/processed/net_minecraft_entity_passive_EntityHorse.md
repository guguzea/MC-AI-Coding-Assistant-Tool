# EntityHorse

## Class signature

```java
public class EntityHorse extends EntityAnimal implements IInvBasic
```

## Constructors

- `public EntityHorse( World p_i1685_1_)`

## Methods

- `protected void entityInit()`
- `public void setHorseType(int p_110214_1_)`
- `public int getHorseType()`
- `public void setHorseVariant(int p_110235_1_)`
- `public int getHorseVariant()`
- `public java.lang.String getCommandSenderName()`
- `public boolean isAdultHorse()`
- `public boolean isTame()`
- `public boolean func_110253_bW()`
- `public java.lang.String func_152119_ch()`
- `public void func_152120_b(java.lang.String p_152120_1_)`
- `public float getHorseSize()`
- `public void setScaleForAge(boolean p_98054_1_)`
- `public boolean isHorseJumping()`
- `public void setHorseTamed(boolean p_110234_1_)`
- `public void setHorseJumping(boolean p_110255_1_)`
- `public boolean allowLeashing()`
- `protected void func_142017_o(float p_142017_1_)`
- `public boolean isChested()`
- `public int func_110241_cb()`
- `public boolean isEatingHaystack()`
- `public boolean isRearing()`
- `public boolean func_110205_ce()`
- `public boolean getHasReproduced()`
- `public void func_146086_d( ItemStack p_146086_1_)`
- `public void func_110242_l(boolean p_110242_1_)`
- `public void setChested(boolean p_110207_1_)`
- `public void setHasReproduced(boolean p_110221_1_)`
- `public void setHorseSaddled(boolean p_110251_1_)`
- `public int getTemper()`
- `public void setTemper(int p_110238_1_)`
- `public int increaseTemper(int p_110198_1_)`
- `public boolean attackEntityFrom( DamageSource p_70097_1_, float p_70097_2_)`
- `public int getTotalArmorValue()`
- `public boolean canBePushed()`
- `public boolean prepareChunkForSpawn()`
- `public void dropChests()`
- `protected void fall(float p_70069_1_)`
- `public void onInventoryChanged( InventoryBasic p_76316_1_)`
- `public boolean getCanSpawnHere()`
- `protected EntityHorse getClosestHorse( Entity p_110250_1_, double p_110250_2_)`
- `public double getHorseJumpStrength()`
- `protected java.lang.String getDeathSound()`
- `protected Item getDropItem()`
- `protected java.lang.String getHurtSound()`
- `public boolean isHorseSaddled()`
- `protected java.lang.String getLivingSound()`
- `protected java.lang.String getAngrySoundName()`
- `protected void func_145780_a(int p_145780_1_, int p_145780_2_, int p_145780_3_, Block p_145780_4_)`
- `protected void applyEntityAttributes()`
- `public int getMaxSpawnedInChunk()`
- `public int getMaxTemper()`
- `protected float getSoundVolume()`
- `public int getTalkInterval()`
- `public boolean func_110239_cn()`
- `public java.lang.String getHorseTexture()`
- `public java.lang.String[] getVariantTexturePaths()`
- `public void openGUI( EntityPlayer p_110199_1_)`
- `public boolean interact( EntityPlayer p_70085_1_)`
- `public boolean func_110259_cr()`
- `public boolean func_110229_cs()`
- `protected boolean isMovementBlocked()`
- `public boolean func_110256_cu()`
- `public boolean func_110222_cv()`
- `public boolean isBreedingItem( ItemStack p_70877_1_)`
- `public void onDeath( DamageSource p_70645_1_)`
- `public void onLivingUpdate()`
- `public void onUpdate()`
- `public void setEating(boolean p_70019_1_)`
- `public void setEatingHaystack(boolean p_110227_1_)`
- `public void setRearing(boolean p_110219_1_)`
- `public void makeHorseRearWithSound()`
- `public void dropChestItems()`
- `public boolean setTamedBy( EntityPlayer p_110263_1_)`
- `public void moveEntityWithHeading(float p_70612_1_, float p_70612_2_)`
- `public void writeEntityToNBT( NBTTagCompound p_70014_1_)`
- `public void readEntityFromNBT( NBTTagCompound p_70037_1_)`
- `public boolean canMateWith( EntityAnimal p_70878_1_)`
- `public EntityAgeable createChild( EntityAgeable p_90011_1_)`
- `public IEntityLivingData onSpawnWithEgg( IEntityLivingData p_110161_1_)`
- `public float getGrassEatingAmount(float p_110258_1_)`
- `public float getRearingAmount(float p_110223_1_)`
- `public float func_110201_q(float p_110201_1_)`
- `protected boolean isAIEnabled()`
- `public void setJumpPower(int p_110206_1_)`
- `protected void spawnHorseParticles(boolean p_110216_1_)`
- `public void handleHealthUpdate(byte p_70103_1_)`
- `public void updateRiderPosition()`
- `public static boolean func_146085_a( Item p_146085_0_)`
- `public boolean isOnLadder()`