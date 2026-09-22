# EntityPlayerMP

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.player.EntityPlayer → net.minecraft.entity.player.EntityPlayerMP

## Class signature

```java
public class EntityPlayerMP extends EntityPlayer implements ICrafting
```

## Constructors

- `EntityPlayerMP(MinecraftServer server, WorldServer worldIn, GameProfile profile, ItemInWorldManager interactionManager)`

## Methods

- `void addChatComponentMessage(IChatComponent chatComponent)`
- `void addChatMessage(IChatComponent component)` — Send a chat message to the CommandSender
- `void addExperienceLevel(int levels)` — Add experience levels to this player.
- `void addSelfToInternalCraftingInventory()`
- `void addStat(StatBase stat, int amount)` — Adds a value to a statistic field.
- `boolean attackEntityFrom(DamageSource source, float amount)` — Called when the entity is attacked.
- `void attackTargetEntityWithCurrentItem(Entity targetEntity)` — Attacks for the player the targeted entity with the currently equipped item.
- `boolean canAttackPlayer(EntityPlayer other)`
- `boolean canCommandSenderUseCommand(int permLevel, java.lang.String commandName)` — Returns true if the CommandSender is allowed to execute the command, false if not
- `void clonePlayer(EntityPlayer oldPlayer, boolean respawnFromEnd)` — Copies the values from the given player into this player if boolean par2 is true.
- `void closeContainer()` — Closes the container the player currently has open.
- `void closeScreen()` — set current crafting inventory back to the 2x2 square
- `void displayGui(IInteractionObject guiOwner)`
- `void displayGUIBook(ItemStack bookStack)` — Displays the GUI for interacting with a book.
- `void displayGUIChest(IInventory chestInventory)` — Displays the GUI for interacting with a chest inventory.
- `void displayGUIHorse(EntityHorse horse, IInventory horseInventory)`
- `void displayVillagerTradeGui(IMerchant villager)`
- `void func_175145_a(StatBase p_175145_1_)`
- `EntityPlayer.EnumChatVisibility getChatVisibility()`
- `long getLastActiveTime()`
- `void getNextWindowId()` — get the next window id to use
- `java.lang.String getPlayerIP()` — Gets the player's IP address.
- `BlockPos getPosition()` — Get the position in the world.
- `WorldServer getServerForPlayer()`
- `Entity getSpectatingEntity()`
- `StatisticsFile getStatFile()` — Gets the stats file for reading achievements
- `IChatComponent getTabListDisplayName()` — Returns null which indicates the tab list should just display the player's name, return a different value to display the specified text instead of the player's name
- `void handleClientSettings(C15PacketClientSettings packetIn)`
- `void handleFalling(double p_71122_1_, boolean p_71122_3_)` — process player falling based on movement packet
- `boolean isSpectatedByPlayer(EntityPlayerMP player)`
- `boolean isSpectator()` — Returns true if the player is in spectator mode.
- `void loadResourcePack(java.lang.String url, java.lang.String hash)`
- `void markPlayerActive()`
- `void mountEntity(Entity entityIn)` — Called when a player mounts an entity. e.g. mounts a pig, mounts a boat.
- `void mountEntityAndWakeUp()`
- `protected void onChangedPotionEffect(PotionEffect id, boolean p_70695_2_)`
- `void onCriticalHit(Entity entityHit)` — Called when the player performs a critical hit on the Entity.
- `void onDeath(DamageSource cause)` — Called when the mob's health reaches 0.
- `void onEnchantmentCritical(Entity entityHit)`
- `protected void onFinishedPotionEffect(PotionEffect p_70688_1_)`
- `void onItemPickup(Entity p_71001_1_, int p_71001_2_)` — Called whenever an item is picked up from walking over it.
- `protected void onItemUseFinish()` — Used for when item use count runs out, ie: eating completed
- `protected void onNewPotionEffect(PotionEffect id)`
- `void onUpdate()` — Called to update the entity's position/logic.
- `void onUpdateEntity()`
- `void openEditSign(TileEntitySign signTile)`
- `void readEntityFromNBT(NBTTagCompound tagCompund)` — (abstract) Protected helper method to read subclass entity data from NBT.
- `void removeEntity(Entity p_152339_1_)` — Sends a packet to the player to remove an entity.
- `void removeExperienceLevel(int levels)`
- `void sendAllWindowProperties(Container p_175173_1_, IInventory p_175173_2_)`
- `void sendContainerToPlayer(Container p_71120_1_)`
- `void sendEndCombat()` — Sends an END_COMBAT packet to the client
- `void sendEnterCombat()` — Sends an ENTER_COMBAT packet to the client
- `void sendPlayerAbilities()` — Sends the player's abilities to the server (if there is one).
- `void sendProgressBarUpdate(Container containerIn, int varToUpdate, int newValue)` — Sends two ints to the client-side Container.
- `void sendSlotContents(Container containerToSend, int slotInd, ItemStack stack)` — Sends the contents of an inventory slot to the client-side Container.
- `void setEntityActionState(float p_110430_1_, float p_110430_2_, boolean p_110430_3_, boolean sneaking)`
- `void setGameType(WorldSettings.GameType gameType)` — Sets the player's game mode and sends it to them.
- `void setItemInUse(ItemStack stack, int duration)` — sets the itemInUse when the use item button is clicked.
- `void setPlayerHealthUpdated()` — this function is called when a players inventory is sent to him, lastHealth is updated on any dimension transitions, then reset.
- `void setPositionAndUpdate(double x, double y, double z)` — Sets the position of the entity and updates the 'last' variables
- `void setSpectatingEntity(Entity entityToSpectate)`
- `void travelToDimension(int dimensionId)` — Teleports the entity to another dimension.
- `EntityPlayer.EnumStatus trySleep(BlockPos bedLocation)`
- `protected void updateBiomesExplored()` — Updates all biomes that have been explored by this player and triggers Adventuring Time if player qualifies.
- `void updateCraftingInventory(Container containerToSend, java.util.List<ItemStack> itemsList)` — update the crafting window inventory with the items in the list
- `protected void updateFallState(double y, boolean onGroundIn, Block blockIn, BlockPos pos)`
- `void updateHeldItem()` — updates item held by mouse
- `protected void updatePotionMetadata()` — Clears potion metadata values if the entity has no potion effects.
- `void wakeUpPlayer(boolean p_70999_1_, boolean updateWorldFlag, boolean setSpawn)` — Wake up the player if they're sleeping.
- `void writeEntityToNBT(NBTTagCompound tagCompound)` — (abstract) Protected helper method to write subclass entity data to NBT.

## Fields

- `int currentWindowId` — The currently in use window ID.
- `boolean isChangingQuantityOnly` — set to true when player is moving quantity of items from one inventory to another(crafting) but item in either slot is not changed
- `java.util.List<ChunkCoordIntPair> loadedChunks`
- `double managedPosX` — player X position as seen by PlayerManager
- `double managedPosZ` — player Z position as seen by PlayerManager
- `MinecraftServer mcServer` — Reference to the MinecraftServer object.
- `int ping`
- `boolean playerConqueredTheEnd` — Set when a player beats the ender dragon, used to respawn the player at the spawn point while retaining inventory and XP
- `NetHandlerPlayServer playerNetServerHandler` — The NetServerHandler assigned to this player by the ServerConfigurationManager.
- `ItemInWorldManager theItemInWorldManager` — The ItemInWorldManager belonging to this player