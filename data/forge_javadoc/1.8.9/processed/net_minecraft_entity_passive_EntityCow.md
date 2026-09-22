# EntityCow

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.EntityLiving → net.minecraft.entity.EntityCreature → net.minecraft.entity.EntityAgeable → net.minecraft.entity.passive.EntityAnimal → net.minecraft.entity.passive.EntityCow

## Class signature

```java
public class EntityCow extends EntityAnimal
```

## Methods

- `protected void applyEntityAttributes()`
- `EntityCow createChild(EntityAgeable ageable)`
- `protected void dropFewItems(boolean p_70628_1_, int p_70628_2_)` — Drop 0-2 items of this living's type
- `protected java.lang.String getDeathSound()` — Returns the sound this mob makes on death.
- `protected Item getDropItem()`
- `float getEyeHeight()`
- `protected java.lang.String getHurtSound()` — Returns the sound this mob makes when it is hurt.
- `protected java.lang.String getLivingSound()` — Returns the sound this mob makes while it's alive.
- `protected float getSoundVolume()` — Returns the volume for the sounds this mob makes.
- `boolean interact(EntityPlayer player)` — Called when a player interacts with a mob. e.g. gets milk from a cow, gets into the saddle on a pig.
- `protected void playStepSound(BlockPos pos, Block blockIn)`

## Fields

- `EntityCow`