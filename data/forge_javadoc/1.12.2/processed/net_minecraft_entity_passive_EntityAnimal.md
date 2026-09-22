# EntityAnimal

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.EntityLiving → net.minecraft.entity.EntityCreature → net.minecraft.entity.EntityAgeable → net.minecraft.entity.passive.EntityAnimal

## Class signature

```java
public abstract class EntityAnimal extends EntityAgeable implements IAnimals
```

## Constructors

- `EntityAnimal(World worldIn)`

## Methods

- `boolean attackEntityFrom(DamageSource source, float amount)`
- `protected boolean canDespawn()`
- `boolean canMateWith(EntityAnimal otherAnimal)`
- `protected void consumeItemFromStack(EntityPlayer player, ItemStack stack)`
- `float getBlockPathWeight(BlockPos pos)`
- `boolean getCanSpawnHere()`
- `protected int getExperiencePoints(EntityPlayer player)`
- `EntityPlayerMP getLoveCause()`
- `int getTalkInterval()`
- `double getYOffset()`
- `void handleStatusUpdate(byte id)`
- `boolean isBreedingItem(ItemStack stack)`
- `boolean isInLove()`
- `void onLivingUpdate()`
- `boolean processInteract(EntityPlayer player, EnumHand hand)`
- `void readEntityFromNBT(NBTTagCompound compound)`
- `void resetInLove()`
- `void setInLove(EntityPlayer player)`
- `protected void updateAITasks()`
- `void writeEntityToNBT(NBTTagCompound compound)`

## Fields

- `protected Block spawnableBlock`