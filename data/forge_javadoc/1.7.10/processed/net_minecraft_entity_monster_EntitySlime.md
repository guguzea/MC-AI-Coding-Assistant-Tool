# EntitySlime

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.EntityLiving → net.minecraft.entity.monster.EntitySlime

## Class signature

```java
public class EntitySlime extends EntityLiving implements IMob
```

## Constructors

- `EntitySlime(World p_i1742_1_)`

## Methods

- `protected void alterSquishAmount()`
- `protected boolean canDamagePlayer()`
- `protected EntitySlime createInstance()`
- `protected void entityInit()`
- `protected int getAttackStrength()`
- `boolean getCanSpawnHere()`
- `protected java.lang.String getDeathSound()`
- `protected Item getDropItem()`
- `protected java.lang.String getHurtSound()`
- `protected int getJumpDelay()`
- `protected java.lang.String getJumpSound()`
- `protected java.lang.String getSlimeParticle()`
- `int getSlimeSize()`
- `protected float getSoundVolume()`
- `int getVerticalFaceSpeed()`
- `protected boolean makesSoundOnJump()`
- `protected boolean makesSoundOnLand()`
- `void onCollideWithPlayer(EntityPlayer p_70100_1_)`
- `void onUpdate()`
- `void readEntityFromNBT(NBTTagCompound p_70037_1_)`
- `void setDead()`
- `protected void setSlimeSize(int p_70799_1_)`
- `protected void updateEntityActionState()`
- `void writeEntityToNBT(NBTTagCompound p_70014_1_)`

## Fields

- `float prevSquishFactor`
- `float squishAmount`
- `float squishFactor`