# EntityBlaze

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.EntityLiving → net.minecraft.entity.EntityCreature → net.minecraft.entity.monster.EntityMob → net.minecraft.entity.monster.EntityBlaze

## Class signature

```java
public class EntityBlaze extends EntityMob
```

## Methods

- `protected void applyEntityAttributes()`
- `protected void dropFewItems(boolean p_70628_1_, int p_70628_2_)` — Drop 0-2 items of this living's type
- `protected void entityInit()`
- `void fall(float distance, float damageMultiplier)`
- `boolean func_70845_n()`
- `float getBrightness(float partialTicks)` — Gets how bright this entity is.
- `int getBrightnessForRender(float partialTicks)`
- `protected java.lang.String getDeathSound()` — Returns the sound this mob makes on death.
- `protected Item getDropItem()`
- `protected java.lang.String getHurtSound()` — Returns the sound this mob makes when it is hurt.
- `protected java.lang.String getLivingSound()` — Returns the sound this mob makes while it's alive.
- `boolean isBurning()` — Returns true if the entity is on fire.
- `protected boolean isValidLightLevel()` — Checks to make sure the light is not too bright where the mob is spawning
- `void onLivingUpdate()` — Called frequently so the entity can update its state every tick as required.
- `void setOnFire(boolean onFire)`
- `protected void updateAITasks()`

## Fields

- `EntityBlaze`