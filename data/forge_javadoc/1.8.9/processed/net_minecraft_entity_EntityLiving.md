# EntityLiving

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.EntityLiving

## Class signature

```java
public abstract class EntityLiving extends EntityLivingBase
```

## Constructors

- `EntityLiving(World worldIn)`

## Methods

- `boolean allowLeashing()`
- `protected void applyEntityAttributes()`
- `boolean canAttackClass(java.lang.Class<? extends EntityLivingBase> cls)` — Returns true if this entity can attack entities of the specified class.
- `boolean canBeSteered()` — returns true if all the conditions for steering the entity are met.
- `protected boolean canDespawn()` — Determines if an entity can be despawned, used on idle far away entities
- `boolean canPickUpLoot()`
- `void clearLeashed(boolean sendPacket, boolean dropLead)` — Removes the leash from this entity
- `protected void despawnEntity()` — Makes the entity despawn if requirements are reached
- `protected void dropEquipment(boolean p_82160_1_, int p_82160_2_)` — Drop the equipment for this entity.
- `protected void dropFewItems(boolean p_70628_1_, int p_70628_2_)` — Drop 0-2 items of this living's type
- `void eatGrassBonus()` — This function applies the benefits of growing back wool and faster growing up to the acting entity.
- `void enablePersistence()` — Enable the Entity persistence
- `protected void entityInit()`
- `void faceEntity(Entity entityIn, float p_70625_2_, float p_70625_3_)` — Changes pitch and yaw so that the entity calling the function is facing the entity provided as an argument.
- `protected float func_110146_f(float p_110146_1_, float p_110146_2_)`
- `protected boolean func_175448_a(ItemStack stack)`
- `static Item getArmorItemForSlot(int armorSlot, int itemTier)` — Gets the vanilla armor Item that can go in the slot specified for the given tier.
- `static int getArmorPosition(ItemStack stack)`
- `EntityLivingBase getAttackTarget()` — Gets the active target the Task system uses for tracking
- `boolean getCanSpawnHere()` — Checks if the entity's current position is a valid location to spawn this entity.
- `ItemStack getCurrentArmor(int slotIn)`
- `protected Item getDropItem()`
- `EntitySenses getEntitySenses()` — returns the EntitySenses Object for the EntityLiving
- `ItemStack getEquipmentInSlot(int slotIn)` — 0: Tool in Hand; 1-4: Armor
- `protected int getExperiencePoints(EntityPlayer player)` — Get the experience points the entity currently has.
- `ItemStack getHeldItem()` — Returns the item that this EntityLiving is holding, if any.
- `ItemStack [] getInventory()` — returns the inventory of this entity (only used in EntityPlayerMP it seems)
- `EntityJumpHelper getJumpHelper()`
- `boolean getLeashed()`
- `Entity getLeashedToEntity()`
- `protected java.lang.String getLivingSound()` — Returns the sound this mob makes while it's alive.
- `EntityLookHelper getLookHelper()`
- `int getMaxFallHeight()` — The maximum height from where the entity is alowed to jump (used in pathfinder)
- `int getMaxSpawnedInChunk()` — Will return how many at most can spawn in a chunk at once.
- `EntityMoveHelper getMoveHelper()`
- `PathNavigate getNavigator()`
- `protected PathNavigate getNewNavigator(World worldIn)` — Returns new PathNavigateGround instance
- `float getRenderSizeModifier()` — Returns render size modifier
- `int getTalkInterval()` — Get number of ticks, at least during which the living entity will be silent.
- `int getVerticalFaceSpeed()` — The speed it takes to move the entityliving's rotationPitch through the faceEntity method.
- `void handleStatusUpdate(byte id)`
- `protected boolean interact(EntityPlayer player)` — Called when a player interacts with a mob. e.g. gets milk from a cow, gets into the saddle on a pig.
- `boolean interactFirst(EntityPlayer playerIn)` — First layer of player interaction
- `boolean isAIDisabled()` — Get whether this Entity's AI is disabled
- `boolean isNoDespawnRequired()`
- `boolean isNotColliding()` — Checks that the entity is not colliding with any blocks / liquids
- `boolean isServerWorld()` — Returns whether the entity is in a server world
- `void onEntityUpdate()` — Gets called every tick from main Entity class
- `IEntityLivingData onInitialSpawn(DifficultyInstance difficulty, IEntityLivingData livingdata)` — Called only once on an entity when first time spawned, via egg, mob spawner, natural spawning etc, but not called when entity is reloaded from nbt.
- `void onLivingUpdate()` — Called frequently so the entity can update its state every tick as required.
- `void onUpdate()` — Called to update the entity's position/logic.
- `void playLivingSound()` — Plays living's sound at its position
- `void readEntityFromNBT(NBTTagCompound tagCompund)` — (abstract) Protected helper method to read subclass entity data from NBT.
- `boolean replaceItemInInventory(int inventorySlot, ItemStack itemStackIn)`
- `void setAIMoveSpeed(float speedIn)` — set the movespeed used for the new AI system
- `void setAttackTarget(EntityLivingBase entitylivingbaseIn)` — Sets the active target the Task system uses for tracking
- `void setCanPickUpLoot(boolean canPickup)`
- `void setCurrentItemOrArmor(int slotIn, ItemStack stack)` — Sets the held item, or an armor slot.
- `protected void setEnchantmentBasedOnDifficulty(DifficultyInstance difficulty)` — Enchants Entity's current equipments based on given DifficultyInstance
- `protected void setEquipmentBasedOnDifficulty(DifficultyInstance difficulty)` — Gives armor or weapon for entity based on given DifficultyInstance
- `void setEquipmentDropChance(int slotIn, float chance)`
- `void setLeashedToEntity(Entity entityIn, boolean sendAttachNotification)` — Sets the entity to be leashed to.
- `void setMoveForward(float p_70657_1_)`
- `void setNoAI(boolean disable)` — Set whether this Entity's AI is disabled
- `void spawnExplosionParticle()` — Spawns an explosion particle around the Entity's location
- `protected void updateAITasks()`
- `protected void updateEntityActionState()`
- `protected void updateEquipmentIfNeeded(EntityItem itemEntity)` — Tests if this entity should pickup a weapon or an armor.
- `protected void updateLeashedState()` — Applies logic related to leashes, for example dragging the entity or breaking the leash.
- `void writeEntityToNBT(NBTTagCompound tagCompound)` — (abstract) Protected helper method to write subclass entity data to NBT.

## Fields

- `protected float[] equipmentDropChances` — Chances for each equipment piece from dropping when this entity dies.
- `protected int experienceValue` — The experience points the Entity gives.
- `protected EntityJumpHelper jumpHelper` — Entity jumping helper
- `int livingSoundTime` — Number of ticks since this EntityLiving last produced its sound
- `protected EntityMoveHelper moveHelper`
- `protected PathNavigate navigator`
- `EntityAITasks targetTasks` — Fighting tasks (used by monsters, wolves, ocelots)
- `EntityAITasks tasks` — Passive tasks (wandering, look, idle, ...)