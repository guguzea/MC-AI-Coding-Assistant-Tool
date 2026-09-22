# EntityGuardian

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.EntityLiving → net.minecraft.entity.EntityCreature → net.minecraft.entity.monster.EntityMob → net.minecraft.entity.monster.EntityGuardian

## Class signature

```java
public class EntityGuardian extends EntityMob
```

## Methods

- `protected void addRandomDrop()` — Causes this Entity to drop a random item.
- `protected void applyEntityAttributes()`
- `boolean attackEntityFrom(DamageSource source, float amount)` — Called when the entity is attacked.
- `protected boolean canTriggerWalking()` — returns if this entity triggers Block.onEntityWalking on the blocks they walk on. used for spiders and wolves to prevent them from trampling crops
- `protected void dropFewItems(boolean p_70628_1_, int p_70628_2_)` — Drop 0-2 items of this living's type
- `protected void entityInit()`
- `int func_175464_ck()`
- `float func_175469_o(float p_175469_1_)`
- `float func_175471_a(float p_175471_1_)`
- `boolean func_175472_n()`
- `float func_175477_p(float p_175477_1_)`
- `float getBlockPathWeight(BlockPos pos)`
- `boolean getCanSpawnHere()` — Checks if the entity's current position is a valid location to spawn this entity.
- `protected java.lang.String getDeathSound()` — Returns the sound this mob makes on death.
- `float getEyeHeight()`
- `protected java.lang.String getHurtSound()` — Returns the sound this mob makes when it is hurt.
- `protected java.lang.String getLivingSound()` — Returns the sound this mob makes while it's alive.
- `protected PathNavigate getNewNavigator(World worldIn)` — Returns new PathNavigateGround instance
- `int getTalkInterval()` — Get number of ticks, at least during which the living entity will be silent.
- `EntityLivingBase getTargetedEntity()`
- `int getVerticalFaceSpeed()` — The speed it takes to move the entityliving's rotationPitch through the faceEntity method.
- `boolean hasTargetedEntity()`
- `boolean isElder()`
- `boolean isNotColliding()` — Checks that the entity is not colliding with any blocks / liquids
- `protected boolean isValidLightLevel()` — Checks to make sure the light is not too bright where the mob is spawning
- `void moveEntityWithHeading(float strafe, float forward)` — Moves the entity based on the specified heading.
- `void onDataWatcherUpdate(int dataID)`
- `void onLivingUpdate()` — Called frequently so the entity can update its state every tick as required.
- `void readEntityFromNBT(NBTTagCompound tagCompund)` — (abstract) Protected helper method to read subclass entity data from NBT.
- `void setElder()`
- `void setElder(boolean elder)` — Sets this Guardian to be an elder or not.
- `protected void updateAITasks()`
- `void writeEntityToNBT(NBTTagCompound tagCompound)` — (abstract) Protected helper method to write subclass entity data to NBT.

## Fields

- `EntityGuardian`