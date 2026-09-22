# EntitySlime

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.EntityLiving → net.minecraft.entity.monster.EntitySlime

## Class signature

```java
public class EntitySlime extends EntityLiving implements IMob
```

## Constructors

- `EntitySlime(World worldIn)`

## Methods

- `protected void alterSquishAmount()`
- `void applyEntityCollision(Entity entityIn)`
- `protected boolean canDamagePlayer()`
- `protected EntitySlime createInstance()`
- `protected void dealDamage(EntityLivingBase entityIn)`
- `protected void entityInit()`
- `protected int getAttackStrength()`
- `boolean getCanSpawnHere()`
- `protected SoundEvent getDeathSound()`
- `protected Item getDropItem()`
- `float getEyeHeight()`
- `protected SoundEvent getHurtSound()`
- `protected int getJumpDelay()`
- `protected SoundEvent getJumpSound()`
- `protected ResourceLocation getLootTable()`
- `protected EnumParticleTypes getParticleType()`
- `int getSlimeSize()`
- `protected float getSoundVolume()`
- `protected SoundEvent getSquishSound()`
- `int getVerticalFaceSpeed()`
- `protected void initEntityAI()`
- `boolean isSmallSlime()`
- `protected void jump()`
- `protected boolean makesSoundOnJump()`
- `void notifyDataManagerChange(DataParameter<?> key)`
- `void onCollideWithPlayer(EntityPlayer entityIn)`
- `IEntityLivingData onInitialSpawn(DifficultyInstance difficulty, IEntityLivingData livingdata)`
- `void onUpdate()`
- `void readEntityFromNBT(NBTTagCompound compound)`
- `static void registerFixesSlime(DataFixer fixer)`
- `void setDead()`
- `protected void setSlimeSize(int size)`
- `protected boolean spawnCustomParticles()` — Called when the slime spawns particles on landing, see onUpdate.
- `void writeEntityToNBT(NBTTagCompound compound)`

## Fields

- `float prevSquishFactor`
- `float squishAmount`
- `float squishFactor`