# EntityPig

## Class signature

```java
public class EntityPig extends EntityAnimal
```

## Constructors

- `public EntityPig( World worldIn)`

## Methods

- `protected void initEntityAI()`
- `protected void applyEntityAttributes()`
- `@Nullable public Entity getControllingPassenger()`
- `public boolean canBeSteered()`
- `protected void entityInit()`
- `public static void registerFixesPig( DataFixer fixer)`
- `public void writeEntityToNBT( NBTTagCompound compound)`
- `public void readEntityFromNBT( NBTTagCompound compound)`
- `protected SoundEvent getAmbientSound()`
- `protected SoundEvent getHurtSound()`
- `protected SoundEvent getDeathSound()`
- `protected void playStepSound( BlockPos pos, Block blockIn)`
- `public boolean processInteract( EntityPlayer player, EnumHand hand, @Nullable ItemStack stack)`
- `protected void dropEquipment(boolean wasRecentlyHit, int lootingModifier)`
- `@Nullable protected ResourceLocation getLootTable()`
- `public boolean getSaddled()`
- `public void setSaddled(boolean saddled)`
- `public void onStruckByLightning( EntityLightningBolt lightningBolt)`
- `public void fall(float distance, float damageMultiplier)`
- `public void moveEntityWithHeading(float strafe, float forward)`
- `public boolean boost()`
- `public EntityPig createChild( EntityAgeable ageable)`
- `public boolean isBreedingItem(@Nullable ItemStack stack)`