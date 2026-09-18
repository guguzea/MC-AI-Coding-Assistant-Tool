# EntityCow

## Class signature

```java
public class EntityCow extends EntityAnimal
```

## Constructors

- `public EntityCow( World worldIn)`

## Methods

- `public static void registerFixesCow( DataFixer fixer)`
- `protected void initEntityAI()`
- `protected void applyEntityAttributes()`
- `protected SoundEvent getAmbientSound()`
- `protected SoundEvent getHurtSound( DamageSource damageSourceIn)`
- `protected SoundEvent getDeathSound()`
- `protected void playStepSound( BlockPos pos, Block blockIn)`
- `protected float getSoundVolume()`
- `protected ResourceLocation getLootTable()`
- `public boolean processInteract( EntityPlayer player, EnumHand hand)`
- `public EntityCow createChild( EntityAgeable ageable)`
- `public float getEyeHeight()`