# EntityPig

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.EntityLiving → net.minecraft.entity.EntityCreature → net.minecraft.entity.EntityAgeable → net.minecraft.entity.passive.EntityAnimal → net.minecraft.entity.passive.EntityPig

## Class signature

```java
public class EntityPig extends EntityAnimal
```

## Methods

- `protected void applyEntityAttributes()`
- `boolean boost()`
- `boolean canBeSteered()`
- `EntityPig createChild(EntityAgeable ageable)`
- `protected void dropEquipment(boolean wasRecentlyHit, int lootingModifier)`
- `protected void entityInit()`
- `void fall(float distance, float damageMultiplier)`
- `protected SoundEvent getAmbientSound()`
- `Entity getControllingPassenger()`
- `protected SoundEvent getDeathSound()`
- `protected SoundEvent getHurtSound()`
- `protected ResourceLocation getLootTable()`
- `boolean getSaddled()`
- `protected void initEntityAI()`
- `boolean isBreedingItem(ItemStack stack)`
- `void moveEntityWithHeading(float strafe, float forward)`
- `void onStruckByLightning(EntityLightningBolt lightningBolt)`
- `protected void playStepSound(BlockPos pos, Block blockIn)`
- `boolean processInteract(EntityPlayer player, EnumHand hand, ItemStack stack)`
- `void readEntityFromNBT(NBTTagCompound compound)`
- `static void registerFixesPig(DataFixer fixer)`
- `void setSaddled(boolean saddled)`
- `void writeEntityToNBT(NBTTagCompound compound)`

## Fields

- `EntityPig`