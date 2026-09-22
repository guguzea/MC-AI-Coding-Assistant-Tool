# EntityParrot

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.EntityLiving → net.minecraft.entity.EntityCreature → net.minecraft.entity.EntityAgeable → net.minecraft.entity.passive.EntityAnimal → net.minecraft.entity.passive.EntityTameable → net.minecraft.entity.passive.EntityShoulderRiding → net.minecraft.entity.passive.EntityParrot

## Class signature

```java
public class EntityParrot extends EntityShoulderRiding implements EntityFlying
```

## Constructors

- `EntityParrot(World worldIn)`

## Methods

- `protected void applyEntityAttributes()`
- `boolean attackEntityAsMob(Entity entityIn)`
- `boolean attackEntityFrom(DamageSource source, float amount)`
- `boolean canBePushed()`
- `boolean canMateWith(EntityAnimal otherAnimal)`
- `protected void collideWithEntity(Entity entityIn)`
- `EntityAgeable createChild(EntityAgeable ageable)`
- `protected PathNavigate createNavigator(World worldIn)`
- `protected void entityInit()`
- `void fall(float distance, float damageMultiplier)`
- `SoundEvent getAmbientSound()`
- `boolean getCanSpawnHere()`
- `protected SoundEvent getDeathSound()`
- `float getEyeHeight()`
- `protected SoundEvent getHurtSound(DamageSource damageSourceIn)`
- `protected ResourceLocation getLootTable()`
- `SoundCategory getSoundCategory()`
- `protected float getSoundPitch()`
- `int getVariant()`
- `protected void initEntityAI()`
- `boolean isBreedingItem(ItemStack stack)`
- `boolean isFlying()`
- `boolean isPartying()`
- `protected boolean makeFlySound()`
- `IEntityLivingData onInitialSpawn(DifficultyInstance difficulty, IEntityLivingData livingdata)`
- `void onLivingUpdate()`
- `static void playAmbientSound(World worldIn, Entity p_192005_1_)`
- `protected float playFlySound(float p_191954_1_)`
- `protected void playStepSound(BlockPos pos, Block blockIn)`
- `boolean processInteract(EntityPlayer player, EnumHand hand)`
- `void readEntityFromNBT(NBTTagCompound compound)`
- `static void registerMimicSound(java.lang.Class<? extends Entity> cls, SoundEvent sound)`
- `void setPartying(BlockPos pos, boolean p_191987_2_)`
- `void setVariant(int p_191997_1_)`
- `protected void updateFallState(double y, boolean onGroundIn, IBlockState state, BlockPos pos)`
- `void writeEntityToNBT(NBTTagCompound compound)`

## Fields

- `float flap`
- `float flapping`
- `float flapSpeed`
- `float oFlap`
- `float oFlapSpeed`