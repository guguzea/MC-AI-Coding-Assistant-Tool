# EntityHorse

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.EntityLiving → net.minecraft.entity.EntityCreature → net.minecraft.entity.EntityAgeable → net.minecraft.entity.passive.EntityAnimal → net.minecraft.entity.passive.AbstractHorse → net.minecraft.entity.passive.EntityHorse

## Class signature

```java
public class EntityHorse extends AbstractHorse
```

## Methods

- `protected void applyEntityAttributes()`
- `boolean canMateWith(EntityAnimal otherAnimal)`
- `EntityAgeable createChild(EntityAgeable ageable)`
- `protected void entityInit()`
- `protected SoundEvent getAmbientSound()`
- `protected SoundEvent getAngrySound()`
- `protected SoundEvent getDeathSound()`
- `HorseArmorType getHorseArmorType()`
- `java.lang.String getHorseTexture()`
- `int getHorseVariant()`
- `protected SoundEvent getHurtSound()`
- `protected ResourceLocation getLootTable()`
- `java.lang.String[] getVariantTexturePaths()`
- `boolean isArmor(ItemStack stack)`
- `IEntityLivingData onInitialSpawn(DifficultyInstance difficulty, IEntityLivingData livingdata)`
- `void onInventoryChanged(IInventory invBasic)`
- `void onUpdate()`
- `protected void playGallopSound(SoundType p_190680_1_)`
- `boolean processInteract(EntityPlayer player, EnumHand hand)`
- `void readEntityFromNBT(NBTTagCompound compound)`
- `static void registerFixesHorse(DataFixer fixer)`
- `void setHorseArmorStack(ItemStack itemStackIn)`
- `void setHorseVariant(int variant)`
- `protected void updateHorseSlots()`
- `boolean wearsArmor()`
- `void writeEntityToNBT(NBTTagCompound compound)`

## Fields

- `EntityHorse`