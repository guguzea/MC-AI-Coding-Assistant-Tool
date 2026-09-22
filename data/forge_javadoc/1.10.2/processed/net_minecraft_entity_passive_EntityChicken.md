# EntityChicken

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.EntityLiving → net.minecraft.entity.EntityCreature → net.minecraft.entity.EntityAgeable → net.minecraft.entity.passive.EntityAnimal → net.minecraft.entity.passive.EntityChicken

## Class signature

```java
public class EntityChicken extends EntityAnimal
```

## Constructors

- `EntityChicken(World worldIn)`

## Methods

- `protected void applyEntityAttributes()`
- `protected boolean canDespawn()`
- `EntityChicken createChild(EntityAgeable ageable)`
- `void fall(float distance, float damageMultiplier)`
- `protected SoundEvent getAmbientSound()`
- `protected SoundEvent getDeathSound()`
- `protected int getExperiencePoints(EntityPlayer player)`
- `float getEyeHeight()`
- `protected SoundEvent getHurtSound()`
- `protected ResourceLocation getLootTable()`
- `protected void initEntityAI()`
- `boolean isBreedingItem(ItemStack stack)`
- `boolean isChickenJockey()`
- `void onLivingUpdate()`
- `protected void playStepSound(BlockPos pos, Block blockIn)`
- `void readEntityFromNBT(NBTTagCompound compound)`
- `static void registerFixesChicken(DataFixer fixer)`
- `void setChickenJockey(boolean jockey)`
- `void updatePassenger(Entity passenger)`
- `void writeEntityToNBT(NBTTagCompound compound)`

## Fields

- `boolean chickenJockey`
- `float destPos`
- `float oFlap`
- `float oFlapSpeed`
- `int timeUntilNextEgg`
- `float wingRotation`
- `float wingRotDelta`