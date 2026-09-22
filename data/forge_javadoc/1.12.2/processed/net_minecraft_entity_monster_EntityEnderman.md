# EntityEnderman

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.EntityLiving → net.minecraft.entity.EntityCreature → net.minecraft.entity.monster.EntityMob → net.minecraft.entity.monster.EntityEnderman

## Class signature

```java
public class EntityEnderman extends EntityMob
```

## Methods

- `protected void applyEntityAttributes()`
- `boolean attackEntityFrom(DamageSource source, float amount)`
- `protected void dropEquipment(boolean wasRecentlyHit, int lootingModifier)`
- `protected void entityInit()`
- `protected SoundEvent getAmbientSound()`
- `static boolean getCarriable(Block block)`
- `protected SoundEvent getDeathSound()`
- `float getEyeHeight()`
- `IBlockState getHeldBlockState()`
- `protected SoundEvent getHurtSound(DamageSource damageSourceIn)`
- `protected ResourceLocation getLootTable()`
- `protected void initEntityAI()`
- `boolean isScreaming()`
- `void notifyDataManagerChange(DataParameter<?> key)`
- `void onLivingUpdate()`
- `void playEndermanSound()`
- `void readEntityFromNBT(NBTTagCompound compound)`
- `static void registerFixesEnderman(DataFixer fixer)`
- `void setAttackTarget(EntityLivingBase entitylivingbaseIn)`
- `static void setCarriable(Block block, boolean canCarry)`
- `void setHeldBlockState(IBlockState state)`
- `protected boolean teleportRandomly()`
- `protected boolean teleportToEntity(Entity p_70816_1_)`
- `protected void updateAITasks()`
- `void writeEntityToNBT(NBTTagCompound compound)`

## Fields

- `EntityEnderman`