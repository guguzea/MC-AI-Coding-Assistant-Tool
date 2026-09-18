# EntityMagmaCube

## Class signature

```java
public class EntityMagmaCube extends EntitySlime
```

## Constructors

- `public EntityMagmaCube( World worldIn)`

## Methods

- `protected void applyEntityAttributes()`
- `public boolean getCanSpawnHere()`
- `public boolean isNotColliding()`
- `public int getTotalArmorValue()`
- `public int getBrightnessForRender(float partialTicks)`
- `public float getBrightness(float partialTicks)`
- `protected EnumParticleTypes getParticleType()`
- `protected EntitySlime createInstance()`
- `protected Item getDropItem()`
- `protected void dropFewItems(boolean p_70628_1_, int p_70628_2_)`
- `public boolean isBurning()`
- `protected int getJumpDelay()`
- `protected void alterSquishAmount()`
- `protected void jump()`
- `protected void handleJumpLava()`
- `public void fall(float distance, float damageMultiplier)`
- `protected boolean canDamagePlayer()`
- `protected int getAttackStrength()`
- `protected java.lang.String getJumpSound()`
- `protected boolean makesSoundOnLand()`

## Description

Indicates weather the slime is able to damage the player (based upon the slime's size)