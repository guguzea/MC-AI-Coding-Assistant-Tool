# EntitySkeleton

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.EntityLiving → net.minecraft.entity.EntityCreature → net.minecraft.entity.monster.EntityMob → net.minecraft.entity.monster.EntitySkeleton

## Class signature

```java
public class EntitySkeleton extends EntityMob implements IRangedAttackMob
```

## Methods

- `protected void applyEntityAttributes()`
- `boolean attackEntityAsMob(Entity entityIn)`
- `void attackEntityWithRangedAttack(EntityLivingBase target, float p_82196_2_)`
- `protected void entityInit()`
- `protected SoundEvent getAmbientSound()`
- `EnumCreatureAttribute getCreatureAttribute()`
- `protected SoundEvent getDeathSound()`
- `float getEyeHeight()`
- `protected SoundEvent getHurtSound()`
- `protected ResourceLocation getLootTable()`
- `int getSkeletonType()`
- `double getYOffset()`
- `protected void initEntityAI()`
- `boolean isSwingingArms()`
- `void onDeath(DamageSource cause)`
- `IEntityLivingData onInitialSpawn(DifficultyInstance difficulty, IEntityLivingData livingdata)`
- `void onLivingUpdate()`
- `protected void playStepSound(BlockPos pos, Block blockIn)`
- `void readEntityFromNBT(NBTTagCompound compound)`
- `void setCombatTask()`
- `protected void setEquipmentBasedOnDifficulty(DifficultyInstance difficulty)`
- `void setItemStackToSlot(EntityEquipmentSlot slotIn, ItemStack stack)`
- `void setSkeletonType(int p_82201_1_)`
- `void setSwingingArms(boolean swingingArms)`
- `void updateRidden()`
- `void writeEntityToNBT(NBTTagCompound compound)`

## Fields

- `EntitySkeleton`