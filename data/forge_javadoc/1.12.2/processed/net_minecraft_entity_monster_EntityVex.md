# EntityVex

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.EntityLiving → net.minecraft.entity.EntityCreature → net.minecraft.entity.monster.EntityMob → net.minecraft.entity.monster.EntityVex

## Class signature

```java
public class EntityVex extends EntityMob
```

## Constructors

- `EntityVex(World worldIn)`

## Methods

- `protected void applyEntityAttributes()`
- `protected void entityInit()`
- `protected SoundEvent getAmbientSound()`
- `BlockPos getBoundOrigin()`
- `float getBrightness()`
- `int getBrightnessForRender()`
- `protected SoundEvent getDeathSound()`
- `protected SoundEvent getHurtSound(DamageSource damageSourceIn)`
- `protected ResourceLocation getLootTable()`
- `EntityLiving getOwner()`
- `protected void initEntityAI()`
- `boolean isCharging()`
- `void move(MoverType type, double x, double y, double z)`
- `IEntityLivingData onInitialSpawn(DifficultyInstance difficulty, IEntityLivingData livingdata)`
- `void onUpdate()`
- `void readEntityFromNBT(NBTTagCompound compound)`
- `static void registerFixesVex(DataFixer fixer)`
- `void setBoundOrigin(BlockPos boundOriginIn)`
- `void setCharging(boolean charging)`
- `protected void setEquipmentBasedOnDifficulty(DifficultyInstance difficulty)`
- `void setLimitedLife(int limitedLifeTicksIn)`
- `void setOwner(EntityLiving ownerIn)`
- `void writeEntityToNBT(NBTTagCompound compound)`

## Fields

- `protected static DataParameter<java.lang.Byte> VEX_FLAGS`