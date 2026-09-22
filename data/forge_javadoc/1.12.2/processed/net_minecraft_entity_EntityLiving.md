# EntityLiving

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.EntityLiving

## Class signature

```java
public abstract class EntityLiving extends EntityLivingBase
```

## Constructors

- `EntityLiving(World worldIn)`

## Methods

- `protected void applyEntityAttributes()`
- `boolean canAttackClass(java.lang.Class<? extends EntityLivingBase> cls)`
- `boolean canBeLeashedTo(EntityPlayer player)`
- `boolean canBeSteered()`
- `protected boolean canDespawn()`
- `protected boolean canEquipItem(ItemStack stack)`
- `boolean canPassengerSteer()`
- `boolean canPickUpLoot()`
- `void clearLeashed(boolean sendPacket, boolean dropLead)`
- `protected EntityBodyHelper createBodyHelper()`
- `protected PathNavigate createNavigator(World worldIn)`
- `protected void despawnEntity()`
- `protected void dropEquipment(boolean wasRecentlyHit, int lootingModifier)`
- `protected void dropFewItems(boolean wasRecentlyHit, int lootingModifier)`
- `protected void dropLoot(boolean wasRecentlyHit, int lootingModifier, DamageSource source)`
- `void eatGrassBonus()`
- `void enablePersistence()`
- `protected void entityInit()`
- `void faceEntity(Entity entityIn, float maxYawIncrease, float maxPitchIncrease)`
- `protected SoundEvent getAmbientSound()`
- `static Item getArmorByChance(EntityEquipmentSlot slotIn, int chance)`
- `java.lang.Iterable<ItemStack> getArmorInventoryList()`
- `EntityLivingBase getAttackTarget()`
- `boolean getCanSpawnHere()`
- `protected Item getDropItem()`
- `EntitySenses getEntitySenses()`
- `protected int getExperiencePoints(EntityPlayer player)`
- `java.lang.Iterable<ItemStack> getHeldEquipment()`
- `int getHorizontalFaceSpeed()`
- `ItemStack getItemStackFromSlot(EntityEquipmentSlot slotIn)`
- `EntityJumpHelper getJumpHelper()`
- `boolean getLeashed()`
- `Entity getLeashHolder()`
- `EntityLookHelper getLookHelper()`
- `protected ResourceLocation getLootTable()`
- `int getMaxFallHeight()`
- `int getMaxSpawnedInChunk()`
- `EntityMoveHelper getMoveHelper()`
- `PathNavigate getNavigator()`
- `float getPathPriority(PathNodeType nodeType)`
- `EnumHandSide getPrimaryHand()`
- `float getRenderSizeModifier()`
- `static EntityEquipmentSlot getSlotForItemStack(ItemStack stack)`
- `int getTalkInterval()`
- `int getVerticalFaceSpeed()`
- `void handleStatusUpdate(byte id)`
- `protected void initEntityAI()`
- `boolean isAIDisabled()`
- `static boolean isItemStackInSlot(EntityEquipmentSlot slotIn, ItemStack stack)`
- `boolean isLeftHanded()`
- `boolean isNoDespawnRequired()`
- `boolean isNotColliding()`
- `boolean isServerWorld()`
- `void onEntityUpdate()`
- `IEntityLivingData onInitialSpawn(DifficultyInstance difficulty, IEntityLivingData livingdata)`
- `void onLivingUpdate()`
- `void onUpdate()`
- `protected void playHurtSound(DamageSource source)`
- `void playLivingSound()`
- `boolean processInitialInteract(EntityPlayer player, EnumHand hand)`
- `protected boolean processInteract(EntityPlayer player, EnumHand hand)`
- `void readEntityFromNBT(NBTTagCompound compound)`
- `static void registerFixesMob(DataFixer fixer, java.lang.Class<?> name)`
- `boolean replaceItemInInventory(int inventorySlot, ItemStack itemStackIn)`
- `void setAIMoveSpeed(float speedIn)`
- `void setAttackTarget(EntityLivingBase entitylivingbaseIn)`
- `void setCanPickUpLoot(boolean canPickup)`
- `void setDropChance(EntityEquipmentSlot slotIn, float chance)`
- `protected void setEnchantmentBasedOnDifficulty(DifficultyInstance difficulty)`
- `protected void setEquipmentBasedOnDifficulty(DifficultyInstance difficulty)`
- `void setItemStackToSlot(EntityEquipmentSlot slotIn, ItemStack stack)`
- `void setLeashHolder(Entity entityIn, boolean sendAttachNotification)`
- `void setLeftHanded(boolean leftHanded)`
- `void setMoveForward(float amount)`
- `void setMoveStrafing(float amount)`
- `void setMoveVertical(float amount)`
- `void setNoAI(boolean disable)`
- `void setPathPriority(PathNodeType nodeType, float priority)`
- `void spawnExplosionParticle()`
- `boolean startRiding(Entity entityIn, boolean force)`
- `protected void updateAITasks()`
- `protected float updateDistance(float p_110146_1_, float p_110146_2_)`
- `protected void updateEntityActionState()`
- `protected void updateEquipmentIfNeeded(EntityItem itemEntity)`
- `protected void updateLeashedState()`
- `void writeEntityToNBT(NBTTagCompound compound)`

## Fields

- `protected int experienceValue`
- `protected float[] inventoryArmorDropChances`
- `protected float[] inventoryHandsDropChances`
- `protected EntityJumpHelper jumpHelper`
- `int livingSoundTime`
- `protected EntityMoveHelper moveHelper`
- `protected PathNavigate navigator`
- `EntityAITasks targetTasks`
- `EntityAITasks tasks`