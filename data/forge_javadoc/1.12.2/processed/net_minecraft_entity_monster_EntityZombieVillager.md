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
- `SoundEvent getHurtSound(DamageSource damageSourceIn)`
- `protected ResourceLocation getLootTable()`
- `@Deprecated int getProfession()`
- `protected ItemStack getSkullDrop()`
- `protected float getSoundPitch()`
- `SoundEvent getStepSound()`
- `void handleStatusUpdate(byte id)`
- `boolean isConverting()`
- `void notifyDataManagerChange(DataParameter<?> key)`
- `IEntityLivingData onInitialSpawn(DifficultyInstance difficulty, IEntityLivingData livingdata)`
- `void onUpdate()`
- `boolean processInteract(EntityPlayer player, EnumHand hand)`
- `void readEntityFromNBT(NBTTagCompound compound)`
- `static void registerFixesZombieVillager(DataFixer fixer)`
- `void setForgeProfession(VillagerRegistry.VillagerProfession prof)`
- `void setProfession(int profession)`
- `protected void startConverting(java.util.UUID conversionStarterIn, int conversionTimeIn)`
- `void writeEntityToNBT(NBTTagCompound compound)`

## Fields

- `EntityZombieVillager`