---
title: "EntityHorse"
description: "public class EntityHorse extends EntityAnimal implements IInvBasic"
package: "net/minecraft/entity/passive"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/net/minecraft/entity/passive/EntityHorse.html"
sourceType: javadoc
---

# EntityHorse

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.EntityLiving → net.minecraft.entity.EntityCreature → net.minecraft.entity.EntityAgeable → net.minecraft.entity.passive.EntityAnimal → net.minecraft.entity.passive.EntityHorse

## Class signature

```java
public class EntityHorse extends EntityAnimal implements IInvBasic
```

## Constructors

- `EntityHorse(World p_i1685_1_)`

## Methods

- `boolean allowLeashing()`
- `protected void applyEntityAttributes()`
- `boolean attackEntityFrom(DamageSource p_70097_1_, float p_70097_2_)`
- `boolean canBePushed()`
- `boolean canMateWith(EntityAnimal p_70878_1_)`
- `EntityAgeable createChild(EntityAgeable p_90011_1_)`
- `void dropChestItems()`
- `void dropChests()`
- `protected void entityInit()`
- `protected void fall(float p_70069_1_)`
- `float func_110201_q(float p_110201_1_)`
- `boolean func_110205_ce()`
- `boolean func_110222_cv()`
- `boolean func_110229_cs()`
- `boolean func_110239_cn()`
- `int func_110241_cb()`
- `void func_110242_l(boolean p_110242_1_)`
- `boolean func_110253_bW()`
- `boolean func_110256_cu()`
- `boolean func_110259_cr()`
- `protected void func_142017_o(float p_142017_1_)`
- `protected void func_145780_a(int p_145780_1_, int p_145780_2_, int p_145780_3_, Block p_145780_4_)`
- `static boolean func_146085_a(Item p_146085_0_)`
- `void func_146086_d(ItemStack p_146086_1_)`
- `java.lang.String func_152119_ch()`
- `void func_152120_b(java.lang.String p_152120_1_)`
- `protected java.lang.String getAngrySoundName()`
- `boolean getCanSpawnHere()`
- `protected EntityHorse getClosestHorse(Entity p_110250_1_, double p_110250_2_)`
- `java.lang.String getCommandSenderName()`
- `protected java.lang.String getDeathSound()`
- `protected Item getDropItem()`
- `float getGrassEatingAmount(float p_110258_1_)`
- `boolean getHasReproduced()`
- `double getHorseJumpStrength()`
- `float getHorseSize()`
- `java.lang.String getHorseTexture()`
- `int getHorseType()`
- `int getHorseVariant()`
- `protected java.lang.String getHurtSound()`
- `protected java.lang.String getLivingSound()`
- `int getMaxSpawnedInChunk()`
- `int getMaxTemper()`
- `float getRearingAmount(float p_110223_1_)`
- `protected float getSoundVolume()`
- `int getTalkInterval()`
- `int getTemper()`
- `int getTotalArmorValue()`
- `java.lang.String[] getVariantTexturePaths()`
- `void handleHealthUpdate(byte p_70103_1_)`
- `int increaseTemper(int p_110198_1_)`
- `boolean interact(EntityPlayer p_70085_1_)`
- `boolean isAdultHorse()`
- `protected boolean isAIEnabled()`
- `boolean isBreedingItem(ItemStack p_70877_1_)`
- `boolean isChested()`
- `boolean isEatingHaystack()`
- `boolean isHorseJumping()`
- `boolean isHorseSaddled()`
- `protected boolean isMovementBlocked()`
- `boolean isOnLadder()`
- `boolean isRearing()`
- `boolean isTame()`
- `void makeHorseRearWithSound()`
- `void moveEntityWithHeading(float p_70612_1_, float p_70612_2_)`
- `void onDeath(DamageSource p_70645_1_)`
- `void onInventoryChanged(InventoryBasic p_76316_1_)`
- `void onLivingUpdate()`
- `IEntityLivingData onSpawnWithEgg(IEntityLivingData p_110161_1_)`
- `void onUpdate()`
- `void openGUI(EntityPlayer p_110199_1_)`
- `boolean prepareChunkForSpawn()`
- `void readEntityFromNBT(NBTTagCompound p_70037_1_)`
- `void setChested(boolean p_110207_1_)`
- `void setEating(boolean p_70019_1_)`
- `void setEatingHaystack(boolean p_110227_1_)`
- `void setHasReproduced(boolean p_110221_1_)`
- `void setHorseJumping(boolean p_110255_1_)`
- `void setHorseSaddled(boolean p_110251_1_)`
- `void setHorseTamed(boolean p_110234_1_)`
- `void setHorseType(int p_110214_1_)`
- `void setHorseVariant(int p_110235_1_)`
- `void setJumpPower(int p_110206_1_)`
- `void setRearing(boolean p_110219_1_)`
- `void setScaleForAge(boolean p_98054_1_)`
- `boolean setTamedBy(EntityPlayer p_110263_1_)`
- `void setTemper(int p_110238_1_)`
- `protected void spawnHorseParticles(boolean p_110216_1_)`
- `void updateRiderPosition()`
- `void writeEntityToNBT(NBTTagCompound p_70014_1_)`

## Fields

- `int field_110278_bp`
- `int field_110279_bq`
- `protected boolean horseJumping`
- `protected float jumpPower`
- `protected int temper`
