# EntityZombieVillager

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.EntityLiving → net.minecraft.entity.EntityCreature → net.minecraft.entity.monster.EntityMob → net.minecraft.entity.monster.EntityZombie → net.minecraft.entity.monster.EntityZombieVillager

## Class signature

```java
public class EntityZombieVillager extends EntityZombie
```

## Methods

- `protected boolean canDespawn()`
- `protected void entityInit()`
- `protected void finishConversion()`
- `SoundEvent getAmbientSound()`
- `protected int getConversionProgress()`
- `SoundEvent getDeathSound()`
- `VillagerRegistry.VillagerProfession getForgeProfession()`
- `SoundEvent getHurtSound()`
- `protected ResourceLocation getLootTable()`
- `int getProfession()`
- `protected ItemStack getSkullDrop()`
- `protected float getSoundPitch()`
- `SoundEvent getStepSound()`
- `void handleStatusUpdate(byte id)`
- `boolean isConverting()`
- `IEntityLivingData onInitialSpawn(DifficultyInstance difficulty, IEntityLivingData livingdata)`
- `void onUpdate()`
- `boolean processInteract(EntityPlayer player, EnumHand hand)`
- `void readEntityFromNBT(NBTTagCompound compound)`
- `static void registerFixesZombieVillager(DataFixer fixer)`
- `void setForgeProfession(VillagerRegistry.VillagerProfession prof)`
- `void setProfession(int profession)`
- `protected void startConverting(int p_190734_1_)`
- `void writeEntityToNBT(NBTTagCompound compound)`

## Fields

- `EntityZombieVillager`