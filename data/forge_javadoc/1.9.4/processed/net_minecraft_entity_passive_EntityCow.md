# EntityCow

## Class signature

```java
public class EntityCow extends EntityAnimal
```

## Constructors

- `public EntityCow( World worldIn)`

## Methods

- `protected void initEntityAI()`
- `protected void applyEntityAttributes()`
- `protected SoundEvent getAmbientSound()`
- `protected SoundEvent getHurtSound()`
- `protected SoundEvent getDeathSound()`
- `protected void playStepSound( BlockPos pos, Block blockIn)`
- `protected float getSoundVolume()`
- `@Nullable protected ResourceLocation getLootTable()`
- `public boolean processInteract( EntityPlayer player, EnumHand hand, @Nullable ItemStack stack)`
- `public EntityCow createChild( EntityAgeable ageable)`
- `public float getEyeHeight()`