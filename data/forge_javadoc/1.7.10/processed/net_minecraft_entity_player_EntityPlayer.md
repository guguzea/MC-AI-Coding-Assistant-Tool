# EntityPlayer

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.player.EntityPlayer

## Class signature

```java
public abstract class EntityPlayer extends EntityLivingBase implements ICommandSender
```

## Constructors

- `EntityPlayer(World p_i45324_1_, GameProfile p_i45324_2_)`

## Methods

- `void addChatComponentMessage(IChatComponent p_146105_1_)`
- `void addExhaustion(float p_71020_1_)`
- `void addExperience(int p_71023_1_)`
- `void addExperienceLevel(int p_82242_1_)`
- `void addMovementStat(double p_71000_1_, double p_71000_3_, double p_71000_5_)`
- `void addScore(int p_85039_1_)`
- `void addStat(StatBase p_71064_1_, int p_71064_2_)`
- `void addToPlayerScore(Entity p_70084_1_, int p_70084_2_)`
- `protected void applyEntityAttributes()`
- `boolean attackEntityFrom(DamageSource p_70097_1_, float p_70097_2_)`
- `void attackTargetEntityWithCurrentItem(Entity p_71059_1_)`
- `boolean canAttackPlayer(EntityPlayer p_96122_1_)`
- `boolean canEat(boolean p_71043_1_)`
- `boolean canHarvestBlock(Block p_146099_1_)`
- `boolean canPlayerEdit(int p_82247_1_, int p_82247_2_, int p_82247_3_, int p_82247_4_, ItemStack p_82247_5_)`
- `protected boolean canTriggerWalking()`
- `void clearItemInUse()`
- `void clonePlayer(EntityPlayer p_71049_1_, boolean p_71049_2_)`
- `void closeScreen()`
- `protected void damageArmor(float p_70675_1_)`
- `protected void damageEntity(DamageSource p_70665_1_, float p_70665_2_)`
- `void destroyCurrentEquippedItem()`
- `void displayGUIAnvil(int p_82244_1_, int p_82244_2_, int p_82244_3_)`
- `void displayGUIBook(ItemStack p_71048_1_)`
- `void displayGUIChest(IInventory p_71007_1_)`
- `void displayGUIEnchantment(int p_71002_1_, int p_71002_2_, int p_71002_3_, java.lang.String p_71002_4_)`
- `void displayGUIHopperMinecart(EntityMinecartHopper p_96125_1_)`
- `void displayGUIHorse(EntityHorse p_110298_1_, IInventory p_110298_2_)`
- `void displayGUIMerchant(IMerchant p_71030_1_, java.lang.String p_71030_2_)`
- `void displayGUIWorkbench(int p_71058_1_, int p_71058_2_, int p_71058_3_)`
- `EntityItem dropOneItem(boolean p_71040_1_)`
- `EntityItem dropPlayerItemWithRandomChoice(ItemStack p_71019_1_, boolean p_71019_2_)`
- `protected void entityInit()`
- `protected void fall(float p_70069_1_)`
- `IChatComponent func_145748_c_()`
- `protected java.lang.String func_146067_o(int p_146067_1_)`
- `void func_146093_a(TileEntityHopper p_146093_1_)`
- `static java.util.UUID func_146094_a(GameProfile p_146094_0_)`
- `void func_146095_a(CommandBlockLogic p_146095_1_)`
- `EntityItem func_146097_a(ItemStack p_146097_1_, boolean p_146097_2_, boolean p_146097_3_)`
- `void func_146098_a(TileEntityBrewingStand p_146098_1_)`
- `void func_146100_a(TileEntity p_146100_1_)`
- `void func_146101_a(TileEntityFurnace p_146101_1_)`
- `void func_146102_a(TileEntityDispenser p_146102_1_)`
- `void func_146104_a(TileEntityBeacon p_146104_1_)`
- `float getAbsorptionAmount()`
- `float getAIMoveSpeed()`
- `boolean getAlwaysRenderNameTagForRender()`
- `float getArmorVisibility()`
- `ChunkCoordinates getBedLocation()`
- `float getBedOrientationInDegrees()`
- `java.lang.String getCommandSenderName()`
- `ItemStack getCurrentArmor(int p_82169_1_)`
- `ItemStack getCurrentEquippedItem()`
- `float getCurrentPlayerStrVsBlock(Block p_146096_1_, boolean p_146096_2_)`
- `protected java.lang.String getDeathSound()`
- `World getEntityWorld()`
- `ItemStack getEquipmentInSlot(int p_71124_1_)`
- `protected int getExperiencePoints(EntityPlayer p_70693_1_)`
- `float getEyeHeight()`
- `FoodStats getFoodStats()`
- `GameProfile getGameProfile()`
- `ItemStack getHeldItem()`
- `boolean getHideCape()`
- `protected boolean getHideCape(int p_82241_1_)`
- `protected java.lang.String getHurtSound()`
- `InventoryEnderChest getInventoryEnderChest()`
- `IIcon getItemIcon(ItemStack p_70620_1_, int p_70620_2_)`
- `ItemStack getItemInUse()`
- `int getItemInUseCount()`
- `int getItemInUseDuration()`
- `ItemStack [] getLastActiveItems()`
- `int getMaxInPortalTime()`
- `int getPortalCooldown()`
- `int getScore()`
- `int getSleepTimer()`
- `protected java.lang.String getSplashSound()`
- `protected java.lang.String getSwimSound()`
- `Team getTeam()`
- `int getTotalArmorValue()`
- `Scoreboard getWorldScoreboard()`
- `double getYOffset()`
- `void handleHealthUpdate(byte p_70103_1_)`
- `boolean interactWith(Entity p_70998_1_)`
- `boolean isBlocking()`
- `boolean isCurrentToolAdventureModeExempt(int p_82246_1_, int p_82246_2_, int p_82246_3_)`
- `boolean isEntityInsideOpaqueBlock()`
- `boolean isInvisibleToPlayer(EntityPlayer p_98034_1_)`
- `protected boolean isMovementBlocked()`
- `protected boolean isPlayer()`
- `boolean isPlayerFullyAsleep()`
- `boolean isPlayerSleeping()`
- `boolean isPushedByWater()`
- `boolean isSpawnForced()`
- `boolean isUsingItem()`
- `void joinEntityItemWithWorld(EntityItem p_71012_1_)`
- `void jump()`
- `void mountEntity(Entity p_70078_1_)`
- `void moveEntityWithHeading(float p_70612_1_, float p_70612_2_)`
- `void onCriticalHit(Entity p_71009_1_)`
- `void onDeath(DamageSource p_70645_1_)`
- `void onEnchantmentCritical(Entity p_71047_1_)`
- `protected void onItemUseFinish()`
- `void onKillEntity(EntityLivingBase p_70074_1_)`
- `void onLivingUpdate()`
- `void onUpdate()`
- `void openGui(java.lang.Object mod, int modGuiId, World world, int x, int y, int z)`
- `void playSound(java.lang.String p_85030_1_, float p_85030_2_, float p_85030_3_)`
- `void preparePlayerToSpawn()`
- `void readEntityFromNBT(NBTTagCompound p_70037_1_)`
- `protected void resetHeight()`
- `void respawnPlayer()`
- `void sendPlayerAbilities()`
- `void setAbsorptionAmount(float p_110149_1_)`
- `void setCurrentItemOrArmor(int p_70062_1_, ItemStack p_70062_2_)`
- `void setDead()`
- `void setGameType(WorldSettings.GameType p_71033_1_)`
- `protected void setHideCape(int p_82239_1_, boolean p_82239_2_)`
- `void setInWeb()`
- `void setItemInUse(ItemStack p_71008_1_, int p_71008_2_)`
- `void setScore(int p_85040_1_)`
- `void setSpawnChunk(ChunkCoordinates p_71063_1_, boolean p_71063_2_)`
- `boolean shouldHeal()`
- `EntityPlayer.EnumStatus sleepInBedAt(int p_71018_1_, int p_71018_2_, int p_71018_3_)`
- `void stopUsingItem()`
- `void triggerAchievement(StatBase p_71029_1_)`
- `protected void updateEntityActionState()`
- `protected void updateItemUse(ItemStack p_71010_1_, int p_71010_2_)`
- `void updateRidden()`
- `static ChunkCoordinates verifyRespawnCoordinates(World p_71056_0_, ChunkCoordinates p_71056_1_, boolean p_71056_2_)`
- `void wakeUpPlayer(boolean p_70999_1_, boolean p_70999_2_, boolean p_70999_3_)`
- `void writeEntityToNBT(NBTTagCompound p_70014_1_)`
- `int xpBarCap()`

## Fields

- `float cameraYaw`
- `PlayerCapabilities capabilities`
- `float experience`
- `int experienceLevel`
- `int experienceTotal`
- `float field_71079_bU`
- `float field_71082_cx`
- `double field_71085_bR`
- `float field_71089_bV`
- `double field_71091_bM`
- `double field_71094_bP`
- `double field_71095_bQ`
- `double field_71096_bN`
- `double field_71097_bO`
- `EntityFishHook fishEntity`
- `protected int flyToggleTimer`
- `protected FoodStats foodStats`
- `InventoryPlayer inventory`
- `Container inventoryContainer`
- `Container openContainer`
- `ChunkCoordinates playerLocation`
- `float prevCameraYaw`
- `protected boolean sleeping`
- `protected float speedInAir`
- `protected float speedOnGround`
- `int xpCooldown`