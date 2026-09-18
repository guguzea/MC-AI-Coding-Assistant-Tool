# DamageSource

## Class signature

```java
public class DamageSource extends java.lang.Object
```

## Constructors

- `public DamageSource(java.lang.String damageTypeIn)`

## Methods

- `public static DamageSource causeMobDamage( EntityLivingBase mob)`
- `public static DamageSource causeIndirectDamage( Entity source, EntityLivingBase indirectEntityIn)`
- `public static DamageSource causePlayerDamage( EntityPlayer player)`
- `public static DamageSource causeArrowDamage( EntityArrow arrow, @Nullable Entity indirectEntityIn)`
- `public static DamageSource causeFireballDamage( EntityFireball fireball, @Nullable Entity indirectEntityIn)`
- `public static DamageSource causeThrownDamage( Entity source, @Nullable Entity indirectEntityIn)`
- `public static DamageSource causeIndirectMagicDamage( Entity source, @Nullable Entity indirectEntityIn)`
- `public static DamageSource causeThornsDamage( Entity source)`
- `public static DamageSource causeExplosionDamage(@Nullable Explosion explosionIn)`
- `public static DamageSource causeExplosionDamage(@Nullable EntityLivingBase entityLivingBaseIn)`
- `public boolean isProjectile()`
- `public DamageSource setProjectile()`
- `public boolean isExplosion()`
- `public DamageSource setExplosion()`
- `public boolean isUnblockable()`
- `public float getHungerDamage()`
- `public boolean canHarmInCreative()`
- `public boolean isDamageAbsolute()`
- `@Nullable public Entity getSourceOfDamage()`
- `@Nullable public Entity getEntity()`
- `public DamageSource setDamageBypassesArmor()`
- `public DamageSource setDamageAllowedInCreativeMode()`
- `public DamageSource setDamageIsAbsolute()`
- `public DamageSource setFireDamage()`
- `public ITextComponent getDeathMessage( EntityLivingBase entityLivingBaseIn)`
- `public boolean isFireDamage()`
- `public java.lang.String getDamageType()`
- `public DamageSource setDifficultyScaled()`
- `public boolean isDifficultyScaled()`
- `public boolean isMagicDamage()`
- `public DamageSource setMagicDamage()`
- `public boolean isCreativePlayer()`
- `@Nullable public Vec3d getDamageLocation()`