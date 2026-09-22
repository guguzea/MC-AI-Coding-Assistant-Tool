# DamageSource

**Inheritance:** java.lang.Object → net.minecraft.util.DamageSource

## Class signature

```java
public class DamageSource extends java.lang.Object
```

## Constructors

- `DamageSource(java.lang.String p_i1566_1_)`

## Methods

- `boolean canHarmInCreative()`
- `static DamageSource causeArrowDamage(EntityArrow p_76353_0_, Entity p_76353_1_)`
- `static DamageSource causeFireballDamage(EntityFireball p_76362_0_, Entity p_76362_1_)`
- `static DamageSource causeIndirectMagicDamage(Entity p_76354_0_, Entity p_76354_1_)`
- `static DamageSource causeMobDamage(EntityLivingBase p_76358_0_)`
- `static DamageSource causePlayerDamage(EntityPlayer p_76365_0_)`
- `static DamageSource causeThornsDamage(Entity p_92087_0_)`
- `static DamageSource causeThrownDamage(Entity p_76356_0_, Entity p_76356_1_)`
- `IChatComponent func_151519_b(EntityLivingBase p_151519_1_)`
- `java.lang.String getDamageType()`
- `Entity getEntity()`
- `float getHungerDamage()`
- `Entity getSourceOfDamage()`
- `boolean isDamageAbsolute()`
- `boolean isDifficultyScaled()`
- `boolean isExplosion()`
- `boolean isFireDamage()`
- `boolean isMagicDamage()`
- `boolean isProjectile()`
- `boolean isUnblockable()`
- `DamageSource setDamageAllowedInCreativeMode()`
- `DamageSource setDamageBypassesArmor()`
- `DamageSource setDamageIsAbsolute()`
- `DamageSource setDifficultyScaled()`
- `DamageSource setExplosion()`
- `static DamageSource setExplosionSource(Explosion p_94539_0_)`
- `DamageSource setFireDamage()`
- `DamageSource setMagicDamage()`
- `DamageSource setProjectile()`

## Fields

- `static DamageSource anvil`
- `static DamageSource cactus`
- `java.lang.String damageType`
- `static DamageSource drown`
- `static DamageSource fall`
- `static DamageSource fallingBlock`
- `static DamageSource generic`
- `static DamageSource inFire`
- `static DamageSource inWall`
- `static DamageSource lava`
- `static DamageSource magic`
- `static DamageSource onFire`
- `static DamageSource outOfWorld`
- `static DamageSource starve`
- `static DamageSource wither`