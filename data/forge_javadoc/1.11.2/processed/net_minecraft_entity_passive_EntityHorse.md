# EntityHorse

## Class signature

```java
public class EntityHorse extends AbstractHorse
```

## Constructors

- `public EntityHorse( World worldIn)`

## Methods

- `protected void entityInit()`
- `public static void registerFixesHorse( DataFixer fixer)`
- `public void writeEntityToNBT( NBTTagCompound compound)`
- `public void readEntityFromNBT( NBTTagCompound compound)`
- `public void setHorseVariant(int variant)`
- `public int getHorseVariant()`
- `public java.lang.String getHorseTexture()`
- `public java.lang.String[] getVariantTexturePaths()`
- `protected void updateHorseSlots()`
- `public void setHorseArmorStack( ItemStack itemStackIn)`
- `public HorseArmorType getHorseArmorType()`
- `public void onInventoryChanged( IInventory invBasic)`
- `protected void playGallopSound( SoundType p_190680_1_)`
- `protected void applyEntityAttributes()`
- `public void onUpdate()`
- `protected SoundEvent getAmbientSound()`
- `protected SoundEvent getDeathSound()`
- `protected SoundEvent getHurtSound()`
- `protected SoundEvent getAngrySound()`
- `protected ResourceLocation getLootTable()`
- `public boolean processInteract( EntityPlayer player, EnumHand hand)`
- `public boolean canMateWith( EntityAnimal otherAnimal)`
- `public EntityAgeable createChild( EntityAgeable ageable)`
- `public boolean wearsArmor()`
- `public boolean isArmor( ItemStack stack)`
- `@Nullable public IEntityLivingData onInitialSpawn( DifficultyInstance difficulty, @Nullable IEntityLivingData livingdata)`