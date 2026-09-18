# EntityPlayerMP

## Class signature

```java
public class EntityPlayerMP extends EntityPlayer implements ICrafting
```

## Constructors

- `public EntityPlayerMP( MinecraftServer server, WorldServer worldIn, GameProfile profile, ItemInWorldManager interactionManager)`

## Methods

- `public void readEntityFromNBT( NBTTagCompound tagCompund)`
- `public void writeEntityToNBT( NBTTagCompound tagCompound)`
- `public void addExperienceLevel(int levels)`
- `public void removeExperienceLevel(int levels)`
- `public void addSelfToInternalCraftingInventory()`
- `public void sendEnterCombat()`
- `public void sendEndCombat()`
- `public void onUpdate()`
- `public void onUpdateEntity()`
- `protected void updateBiomesExplored()`
- `public void onDeath( DamageSource cause)`
- `public boolean attackEntityFrom( DamageSource source, float amount)`
- `public boolean canAttackPlayer( EntityPlayer other)`
- `public void travelToDimension(int dimensionId)`
- `public boolean isSpectatedByPlayer( EntityPlayerMP player)`
- `public void onItemPickup( Entity p_71001_1_, int p_71001_2_)`
- `public EntityPlayer.EnumStatus trySleep( BlockPos bedLocation)`
- `public void wakeUpPlayer(boolean p_70999_1_, boolean updateWorldFlag, boolean setSpawn)`
- `public void mountEntity( Entity entityIn)`
- `protected void updateFallState(double y, boolean onGroundIn, Block blockIn, BlockPos pos)`
- `public void handleFalling(double p_71122_1_, boolean p_71122_3_)`
- `public void openEditSign( TileEntitySign signTile)`
- `public void getNextWindowId()`
- `public void displayGui( IInteractionObject guiOwner)`
- `public void displayGUIChest( IInventory chestInventory)`
- `public void displayVillagerTradeGui( IMerchant villager)`
- `public void displayGUIHorse( EntityHorse horse, IInventory horseInventory)`
- `public void displayGUIBook( ItemStack bookStack)`
- `public void sendSlotContents( Container containerToSend, int slotInd, ItemStack stack)`
- `public void sendContainerToPlayer( Container p_71120_1_)`
- `public void updateCraftingInventory( Container containerToSend, java.util.List< ItemStack > itemsList)`
- `public void sendProgressBarUpdate( Container containerIn, int varToUpdate, int newValue)`
- `public void sendAllWindowProperties( Container p_175173_1_, IInventory p_175173_2_)`
- `public void closeScreen()`
- `public void updateHeldItem()`
- `public void closeContainer()`
- `public void setEntityActionState(float p_110430_1_, float p_110430_2_, boolean p_110430_3_, boolean sneaking)`
- `public void addStat( StatBase stat, int amount)`
- `public void func_175145_a( StatBase p_175145_1_)`
- `public void mountEntityAndWakeUp()`
- `public void setPlayerHealthUpdated()`
- `public void addChatComponentMessage( IChatComponent chatComponent)`
- `protected void onItemUseFinish()`
- `public void setItemInUse( ItemStack stack, int duration)`
- `public void clonePlayer( EntityPlayer oldPlayer, boolean respawnFromEnd)`
- `protected void onNewPotionEffect( PotionEffect id)`
- `protected void onChangedPotionEffect( PotionEffect id, boolean p_70695_2_)`
- `protected void onFinishedPotionEffect( PotionEffect p_70688_1_)`
- `public void setPositionAndUpdate(double x, double y, double z)`
- `public void onCriticalHit( Entity entityHit)`
- `public void onEnchantmentCritical( Entity entityHit)`
- `public void sendPlayerAbilities()`
- `public WorldServer getServerForPlayer()`
- `public void setGameType( WorldSettings.GameType gameType)`
- `public boolean isSpectator()`
- `public void addChatMessage( IChatComponent component)`
- `public boolean canCommandSenderUseCommand(int permLevel, java.lang.String commandName)`
- `public java.lang.String getPlayerIP()`
- `public void handleClientSettings( C15PacketClientSettings packetIn)`
- `public EntityPlayer.EnumChatVisibility getChatVisibility()`
- `public void loadResourcePack(java.lang.String url, java.lang.String hash)`
- `public BlockPos getPosition()`
- `public void markPlayerActive()`
- `public StatisticsFile getStatFile()`
- `public void removeEntity( Entity p_152339_1_)`
- `protected void updatePotionMetadata()`
- `public Entity getSpectatingEntity()`
- `public void setSpectatingEntity( Entity entityToSpectate)`
- `public void attackTargetEntityWithCurrentItem( Entity targetEntity)`
- `public long getLastActiveTime()`
- `public IChatComponent getTabListDisplayName()`

## Description

The currently in use window ID.