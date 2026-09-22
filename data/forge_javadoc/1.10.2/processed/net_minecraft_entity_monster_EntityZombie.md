# EntityZombie

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.EntityLiving → net.minecraft.entity.EntityCreature → net.minecraft.entity.monster.EntityMob → net.minecraft.entity.monster.EntityZombie

## Class signature

```java
public class EntityZombie extends EntityMob
```

## Constructors

- `EntityZombie(World worldIn)`

## Methods

- `protected void applyEntityAI()`
- `protected void applyEntityAttributes()`
- `boolean attackEntityAsMob(Entity entityIn)`
- `boolean attackEntityFrom(DamageSource source, float amount)`
- `protected boolean canDespawn()`
- `protected boolean canEquipItem(ItemStack stack)`
- `protected void convertToVillager()`
- `protected void entityInit()`
- `protected SoundEvent getAmbientSound()`
- `protected int getConversionTimeBoost()`
- `EnumCreatureAttribute getCreatureAttribute()`
- `protected SoundEvent getDeathSound()`
- `protected int getExperiencePoints(EntityPlayer player)`
- `float getEyeHeight()`
- `protected SoundEvent getHurtSound()`
- `protected ResourceLocation getLootTable()`
- `java.lang.String getName()`
- `VillagerRegistry.VillagerProfession getVillagerTypeForge()`
- `double getYOffset()`
- `@Deprecated ZombieType getZombieType()`
- `void handleStatusUpdate(byte id)`
- `protected void initEntityAI()`
- `boolean isArmsRaised()`
- `boolean isBreakDoorsTaskSet()`
- `boolean isChild()`
- `boolean isConverting()`
- `boolean isVillager()`
- `protected void multiplySize(float size)`
- `void notifyDataManagerChange(DataParameter<?> key)`
- `void onDeath(DamageSource cause)`
- `IEntityLivingData onInitialSpawn(DifficultyInstance difficulty, IEntityLivingData livingdata)`
- `void onKillEntity(EntityLivingBase entityLivingIn)`
- `void onLivingUpdate()`
- `void onUpdate()`
- `protected void playStepSound(BlockPos pos, Block blockIn)`
- `boolean processInteract(EntityPlayer player, EnumHand hand, ItemStack stack)`
- `void readEntityFromNBT(NBTTagCompound compound)`
- `static void registerFixesZombie(DataFixer fixer)`
- `void setArmsRaised(boolean armsRaised)`
- `void setBreakDoorsAItask(boolean enabled)`
- `void setChild(boolean childZombie)`
- `void setChildSize(boolean isChild)`
- `protected void setEquipmentBasedOnDifficulty(DifficultyInstance difficulty)`
- `protected void setSize(float width, float height)`
- `void setVillagerType(VillagerRegistry.VillagerProfession type)`
- `@Deprecated void setZombieType(ZombieType type)`
- `protected void startConversion(int ticks)`
- `void writeEntityToNBT(NBTTagCompound compound)`

## Fields

- `protected static IAttribute SPAWN_REINFORCEMENTS_CHANCE`