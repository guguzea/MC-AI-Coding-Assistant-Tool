# EntitySpider

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.EntityLiving → net.minecraft.entity.EntityCreature → net.minecraft.entity.monster.EntityMob → net.minecraft.entity.monster.EntitySpider

## Class signature

```java
public class EntitySpider extends EntityMob
```

## Methods

- `protected void applyEntityAttributes()`
- `protected void dropFewItems(boolean p_70628_1_, int p_70628_2_)` — Drop 0-2 items of this living's type
- `protected void entityInit()`
- `EnumCreatureAttribute getCreatureAttribute()` — Get this Entity's EnumCreatureAttribute
- `protected java.lang.String getDeathSound()` — Returns the sound this mob makes on death.
- `protected Item getDropItem()`
- `float getEyeHeight()`
- `protected java.lang.String getHurtSound()` — Returns the sound this mob makes when it is hurt.
- `protected java.lang.String getLivingSound()` — Returns the sound this mob makes while it's alive.
- `double getMountedYOffset()` — Returns the Y offset from the entity's position for any entity riding this one.
- `protected PathNavigate getNewNavigator(World worldIn)` — Returns new PathNavigateGround instance
- `boolean isBesideClimbableBlock()` — Returns true if the WatchableObject (Byte) is 0x01 otherwise returns false.
- `boolean isOnLadder()` — returns true if this entity is by a ladder, false otherwise
- `boolean isPotionApplicable(PotionEffect potioneffectIn)`
- `IEntityLivingData onInitialSpawn(DifficultyInstance difficulty, IEntityLivingData livingdata)` — Called only once on an entity when first time spawned, via egg, mob spawner, natural spawning etc, but not called when entity is reloaded from nbt.
- `void onUpdate()` — Called to update the entity's position/logic.
- `protected void playStepSound(BlockPos pos, Block blockIn)`
- `void setBesideClimbableBlock(boolean p_70839_1_)` — Updates the WatchableObject (Byte) created in entityInit(), setting it to 0x01 if par1 is true or 0x00 if it is false.
- `void setInWeb()` — Sets the Entity inside a web block.

## Fields

- `EntitySpider`