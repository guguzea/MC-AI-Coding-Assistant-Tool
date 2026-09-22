# EntityWitch

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.EntityLiving → net.minecraft.entity.EntityCreature → net.minecraft.entity.monster.EntityMob → net.minecraft.entity.monster.EntityWitch

## Class signature

```java
public class EntityWitch extends EntityMob implements IRangedAttackMob
```

## Methods

- `protected void applyEntityAttributes()`
- `protected float applyPotionDamageCalculations(DamageSource source, float damage)` — Reduces damage, depending on potions
- `void attackEntityWithRangedAttack(EntityLivingBase p_82196_1_, float p_82196_2_)` — Attack the specified entity using a ranged attack.
- `protected void dropFewItems(boolean p_70628_1_, int p_70628_2_)` — Drop 0-2 items of this living's type
- `protected void entityInit()`
- `boolean getAggressive()` — Return whether this witch is aggressive at an entity.
- `protected java.lang.String getDeathSound()` — Returns the sound this mob makes on death.
- `float getEyeHeight()`
- `protected java.lang.String getHurtSound()` — Returns the sound this mob makes when it is hurt.
- `protected java.lang.String getLivingSound()` — Returns the sound this mob makes while it's alive.
- `void handleStatusUpdate(byte id)`
- `void onLivingUpdate()` — Called frequently so the entity can update its state every tick as required.
- `void setAggressive(boolean aggressive)` — Set whether this witch is aggressive at an entity.

## Fields

- `EntityWitch`