# EntityMob

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.EntityLiving → net.minecraft.entity.EntityCreature → net.minecraft.entity.monster.EntityMob

## Class signature

```java
public abstract class EntityMob extends EntityCreature implements IMob
```

## Methods

- `protected void applyEntityAttributes()`
- `boolean attackEntityAsMob(Entity entityIn)`
- `boolean attackEntityFrom(DamageSource source, float amount)`
- `protected boolean canDropLoot()`
- `float getBlockPathWeight(BlockPos pos)`
- `boolean getCanSpawnHere()`
- `protected SoundEvent getDeathSound()`
- `protected SoundEvent getFallSound(int heightIn)`
- `protected SoundEvent getHurtSound()`
- `SoundCategory getSoundCategory()`
- `protected SoundEvent getSplashSound()`
- `protected SoundEvent getSwimSound()`
- `protected boolean isValidLightLevel()`
- `void onLivingUpdate()`
- `void onUpdate()`
- `static void registerFixesMonster(DataFixer fixer)`

## Fields

- `EntityMob`