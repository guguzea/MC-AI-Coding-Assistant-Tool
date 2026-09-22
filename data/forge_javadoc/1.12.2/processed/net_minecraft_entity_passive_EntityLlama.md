# EntityLlama

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.EntityLiving → net.minecraft.entity.EntityCreature → net.minecraft.entity.EntityAgeable → net.minecraft.entity.passive.EntityAnimal → net.minecraft.entity.passive.AbstractHorse → net.minecraft.entity.passive.AbstractChestHorse → net.minecraft.entity.passive.EntityLlama

## Class signature

```java
public class EntityLlama extends AbstractChestHorse implements IRangedAttackMob
```

## Methods

- `protected void applyEntityAttributes()`
- `void attackEntityWithRangedAttack(EntityLivingBase target, float distanceFactor)`
- `boolean canBeSaddled()`
- `boolean canBeSteered()`
- `boolean canEatGrass()`
- `boolean canMateWith(EntityAnimal otherAnimal)`
- `EntityLlama createChild(EntityAgeable ageable)`
- `protected void entityInit()`
- `void fall(float distance, float damageMultiplier)`
- `protected double followLeashSpeed()`
- `protected void followMother()`
- `protected SoundEvent getAmbientSound()`
- `protected SoundEvent getAngrySound()`
- `EntityLlama getCaravanHead()`
- `EnumDyeColor getColor()`
- `protected SoundEvent getDeathSound()`
- `protected SoundEvent getHurtSound(DamageSource damageSourceIn)`
- `int getInventoryColumns()`
- `protected int getInventorySize()`
- `protected ResourceLocation getLootTable()`
- `int getMaxTemper()`
- `double getMountedYOffset()`
- `int getStrength()`
- `int getVariant()`
- `protected boolean handleEating(EntityPlayer player, ItemStack stack)`
- `boolean hasCaravanTrail()`
- `boolean hasColor()`
- `boolean inCaravan()`
- `protected void initEntityAI()`
- `boolean isArmor(ItemStack stack)`
- `protected boolean isMovementBlocked()`
- `void joinCaravan(EntityLlama caravanHeadIn)`
- `void leaveCaravan()`
- `void makeMad()`
- `IEntityLivingData onInitialSpawn(DifficultyInstance difficulty, IEntityLivingData livingdata)`
- `void onInventoryChanged(IInventory invBasic)`
- `protected void playChestEquipSound()`
- `protected void playStepSound(BlockPos pos, Block blockIn)`
- `void readEntityFromNBT(NBTTagCompound compound)`
- `void setSwingingArms(boolean swingingArms)`
- `void setVariant(int variantIn)`
- `protected void updateHorseSlots()`
- `void updatePassenger(Entity passenger)`
- `boolean wearsArmor()`
- `void writeEntityToNBT(NBTTagCompound compound)`

## Fields

- `EntityLlama`