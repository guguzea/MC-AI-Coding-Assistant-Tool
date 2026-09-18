---
title: "EntityAreaEffectCloud"
description: "public class EntityAreaEffectCloud extends Entity"
package: "net/minecraft/entity"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/entity/EntityAreaEffectCloud.html"
sourceType: javadoc
---

# EntityAreaEffectCloud

## Class signature

```java
public class EntityAreaEffectCloud extends Entity
```

## Constructors

- `public EntityAreaEffectCloud( World worldIn)`
- `public EntityAreaEffectCloud( World worldIn, double x, double y, double z)`

## Methods

- `protected void entityInit()`
- `public void setRadius(float radiusIn)`
- `public float getRadius()`
- `public void setPotion( PotionType potionIn)`
- `public void addEffect( PotionEffect effect)`
- `public int getColor()`
- `public void setColor(int colorIn)`
- `public EnumParticleTypes getParticle()`
- `public void setParticle( EnumParticleTypes particleIn)`
- `public int getParticleParam1()`
- `public void setParticleParam1(int particleParam)`
- `public int getParticleParam2()`
- `public void setParticleParam2(int particleParam)`
- `protected void setIgnoreRadius(boolean ignoreRadius)`
- `public boolean shouldIgnoreRadius()`
- `public int getDuration()`
- `public void setDuration(int durationIn)`
- `public void onUpdate()`
- `public void setRadiusOnUse(float radiusOnUseIn)`
- `public void setRadiusPerTick(float radiusPerTickIn)`
- `public void setWaitTime(int waitTimeIn)`
- `public void setOwner( EntityLivingBase ownerIn)`
- `public EntityLivingBase getOwner()`
- `protected void readEntityFromNBT( NBTTagCompound compound)`
- `protected void writeEntityToNBT( NBTTagCompound compound)`
- `public void notifyDataManagerChange( DataParameter <?> key)`
- `public EnumPushReaction getPushReaction()`
