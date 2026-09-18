# EntityDragon

## Class signature

```java
public class EntityDragon extends EntityLiving implements IBossDisplayData , IEntityMultiPart , IMob
```

## Constructors

- `public EntityDragon( World p_i1700_1_)`

## Methods

- `protected void applyEntityAttributes()`
- `protected void entityInit()`
- `public double[] getMovementOffsets(int p_70974_1_, float p_70974_2_)`
- `public void onLivingUpdate()`
- `public boolean attackEntityFromPart( EntityDragonPart p_70965_1_, DamageSource p_70965_2_, float p_70965_3_)`
- `public boolean attackEntityFrom( DamageSource p_70097_1_, float p_70097_2_)`
- `protected boolean func_82195_e( DamageSource p_82195_1_, float p_82195_2_)`
- `protected void onDeathUpdate()`
- `protected void despawnEntity()`
- `public Entity [] getParts()`
- `public boolean canBeCollidedWith()`
- `public World func_82194_d()`
- `protected java.lang.String getLivingSound()`
- `protected java.lang.String getHurtSound()`
- `protected float getSoundVolume()`