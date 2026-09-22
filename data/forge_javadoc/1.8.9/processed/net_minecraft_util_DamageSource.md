# DamageSource

**Inheritance:** java.lang.Object → net.minecraft.util.DamageSource

## Class signature

```java
public class DamageSource extends java.lang.Object
```

## Constructors

- `DamageSource(java.lang.String damageTypeIn)`

## Methods

- `boolean canHarmInCreative()`
- `static DamageSource causeArrowDamage(EntityArrow arrow, Entity p_76353_1_)` — returns EntityDamageSourceIndirect of an arrow
- `static DamageSource causeFireballDamage(EntityFireball fireball, Entity p_76362_1_)` — returns EntityDamageSourceIndirect of a fireball
- `static DamageSource causeIndirectMagicDamage(Entity p_76354_0_, Entity p_76354_1_)`
- `static DamageSource causeMobDamage(EntityLivingBase mob)`
- `static DamageSource causePlayerDamage(EntityPlayer player)` — returns an EntityDamageSource of type player
- `static DamageSource causeThornsDamage(Entity p_92087_0_)` — Returns the EntityDamageSource of the Thorns enchantment
- `static DamageSource causeThrownDamage(Entity p_76356_0_, Entity p_76356_1_)`
- `java.lang.String getDamageType()` — Return the name of damage type.
- `IChatComponent getDeathMessage(EntityLivingBase p_151519_1_)` — Gets the death message that is displayed when the player dies
- `Entity getEntity()`
- `float getHungerDamage()` — How much satiate(food) is consumed by this DamageSource
- `Entity getSourceOfDamage()`
- `boolean isCreativePlayer()`
- `boolean isDamageAbsolute()` — Whether or not the damage ignores modification by potion effects or enchantments.
- `boolean isDifficultyScaled()` — Return whether this damage source will have its damage amount scaled based on the current difficulty.
- `boolean isExplosion()`
- `boolean isFireDamage()` — Returns true if the damage is fire based.
- `boolean isMagicDamage()` — Returns true if the damage is magic based.
- `boolean isProjectile()` — Returns true if the damage is projectile based.
- `boolean isUnblockable()`
- `DamageSource setDamageAllowedInCreativeMode()`
- `DamageSource setDamageBypassesArmor()`
- `DamageSource setDamageIsAbsolute()` — Sets a value indicating whether the damage is absolute (ignores modification by potion effects or enchantments), and also clears out hunger damage.
- `DamageSource setDifficultyScaled()` — Set whether this damage source will have its damage amount scaled based on the current difficulty.
- `DamageSource setExplosion()`
- `static DamageSource setExplosionSource(Explosion explosionIn)`
- `DamageSource setFireDamage()` — Define the damage type as fire based.
- `DamageSource setMagicDamage()` — Define the damage type as magic based.
- `DamageSource setProjectile()` — Define the damage type as projectile based.

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
- `static DamageSource lightningBolt`
- `static DamageSource magic`
- `static DamageSource onFire`
- `static DamageSource outOfWorld`
- `static DamageSource starve`
- `static DamageSource wither`