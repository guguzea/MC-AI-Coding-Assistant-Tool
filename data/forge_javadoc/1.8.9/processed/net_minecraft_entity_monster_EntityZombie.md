# EntityZombie

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.EntityLiving → net.minecraft.entity.EntityCreature → net.minecraft.entity.monster.EntityMob → net.minecraft.entity.monster.EntityZombie

## Class signature

```java
public class EntityZombie extends EntityMob
```

## Constructors

- `EntityZombie(World worldIn)`

## Methods

- `protected void addRandomDrop()` — Causes this Entity to drop a random item.
- `protected void applyEntityAI()`
- `protected void applyEntityAttributes()`
- `boolean attackEntityAsMob(Entity entityIn)`
- `boolean attackEntityFrom(DamageSource source, float amount)` — Called when the entity is attacked.
- `protected boolean canDespawn()` — Determines if an entity can be despawned, used on idle far away entities
- `protected void convertToVillager()` — Convert this zombie into a villager.
- `protected void entityInit()`
- `protected boolean func_175448_a(ItemStack stack)`
- `protected int getConversionTimeBoost()` — Return the amount of time decremented from conversionTime every tick.
- `EnumCreatureAttribute getCreatureAttribute()` — Get this Entity's EnumCreatureAttribute
- `protected java.lang.String getDeathSound()` — Returns the sound this mob makes on death.
- `protected Item getDropItem()`
- `protected int getExperiencePoints(EntityPlayer player)` — Get the experience points the entity currently has.
- `float getEyeHeight()`
- `protected java.lang.String getHurtSound()` — Returns the sound this mob makes when it is hurt.
- `protected java.lang.String getLivingSound()` — Returns the sound this mob makes while it's alive.
- `int getTotalArmorValue()` — Returns the current armor value as determined by a call to InventoryPlayer.getTotalArmorValue
- `double getYOffset()` — Returns the Y Offset of this entity.
- `void handleStatusUpdate(byte id)`
- `boolean interact(EntityPlayer player)` — Called when a player interacts with a mob. e.g. gets milk from a cow, gets into the saddle on a pig.
- `boolean isBreakDoorsTaskSet()`
- `boolean isChild()` — If Animal, checks if the age timer is negative
- `boolean isConverting()` — Returns whether this zombie is in the process of converting to a villager
- `boolean isVillager()` — Return whether this zombie is a villager.
- `protected void multiplySize(float size)` — Multiplies the height and width by the provided float.
- `void onDeath(DamageSource cause)` — Called when the mob's health reaches 0.
- `IEntityLivingData onInitialSpawn(DifficultyInstance difficulty, IEntityLivingData livingdata)` — Called only once on an entity when first time spawned, via egg, mob spawner, natural spawning etc, but not called when entity is reloaded from nbt.
- `void onKillEntity(EntityLivingBase entityLivingIn)` — This method gets called when the entity kills another one.
- `void onLivingUpdate()` — Called frequently so the entity can update its state every tick as required.
- `void onUpdate()` — Called to update the entity's position/logic.
- `protected void playStepSound(BlockPos pos, Block blockIn)`
- `void readEntityFromNBT(NBTTagCompound tagCompund)` — (abstract) Protected helper method to read subclass entity data from NBT.
- `void setBreakDoorsAItask(boolean par1)` — Sets or removes EntityAIBreakDoor task
- `void setChild(boolean childZombie)` — Set whether this zombie is a child.
- `void setChildSize(boolean isChild)` — sets the size of the entity to be half of its current size if true.
- `protected void setEquipmentBasedOnDifficulty(DifficultyInstance difficulty)` — Gives armor or weapon for entity based on given DifficultyInstance
- `protected void setSize(float width, float height)` — Sets the width and height of the entity.
- `void setVillager(boolean villager)` — Set whether this zombie is a villager.
- `protected void startConversion(int ticks)` — Starts converting this zombie into a villager.
- `void writeEntityToNBT(NBTTagCompound tagCompound)` — (abstract) Protected helper method to write subclass entity data to NBT.

## Fields

- `protected static IAttribute reinforcementChance` — The attribute which determines the chance that this mob will spawn reinforcements