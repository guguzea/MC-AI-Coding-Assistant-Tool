# EntitySnowman

## Class signature

```java
public class EntitySnowman extends EntityGolem implements IRangedAttackMob
```

## Constructors

- `public EntitySnowman( World worldIn)`

## Methods

- `protected void initEntityAI()`
- `protected void applyEntityAttributes()`
- `protected void entityInit()`
- `public void onLivingUpdate()`
- `@Nullable protected ResourceLocation getLootTable()`
- `public void attackEntityWithRangedAttack( EntityLivingBase target, float p_82196_2_)`
- `public float getEyeHeight()`
- `protected boolean processInteract( EntityPlayer player, EnumHand hand, @Nullable ItemStack stack)`
- `public boolean isPumpkinEquipped()`
- `public void setPumpkinEquipped(boolean pumpkinEquipped)`
- `@Nullable protected SoundEvent getAmbientSound()`
- `@Nullable protected SoundEvent getHurtSound()`
- `@Nullable protected SoundEvent getDeathSound()`