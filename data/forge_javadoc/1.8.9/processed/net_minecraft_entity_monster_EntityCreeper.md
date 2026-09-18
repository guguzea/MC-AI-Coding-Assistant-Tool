# EntityCreeper

## Class signature

```java
public class EntityCreeper extends EntityMob
```

## Constructors

- `public EntityCreeper( World worldIn)`

## Methods

- `protected void applyEntityAttributes()`
- `public int getMaxFallHeight()`
- `public void fall(float distance, float damageMultiplier)`
- `protected void entityInit()`
- `public void writeEntityToNBT( NBTTagCompound tagCompound)`
- `public void readEntityFromNBT( NBTTagCompound tagCompund)`
- `public void onUpdate()`
- `protected java.lang.String getHurtSound()`
- `protected java.lang.String getDeathSound()`
- `public void onDeath( DamageSource cause)`
- `public boolean attackEntityAsMob( Entity entityIn)`
- `public boolean getPowered()`
- `public float getCreeperFlashIntensity(float p_70831_1_)`
- `protected Item getDropItem()`
- `public int getCreeperState()`
- `public void setCreeperState(int state)`
- `public void onStruckByLightning( EntityLightningBolt lightningBolt)`
- `protected boolean interact( EntityPlayer player)`
- `public boolean hasIgnited()`
- `public void ignite()`
- `public boolean isAIEnabled()`
- `public void func_175493_co()`

## Description

Params: (Float)Render tick.