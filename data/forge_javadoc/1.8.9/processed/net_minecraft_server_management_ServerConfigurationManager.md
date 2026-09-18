# ServerConfigurationManager

## Class signature

```java
public abstract class ServerConfigurationManager extends java.lang.Object
```

## Constructors

- `public ServerConfigurationManager( MinecraftServer server)`

## Methods

- `public void initializeConnectionToPlayer( NetworkManager netManager, EntityPlayerMP playerIn, NetHandlerPlayServer nethandlerplayserver)`
- `protected void sendScoreboard( ServerScoreboard scoreboardIn, EntityPlayerMP playerIn)`
- `public void setPlayerManager( WorldServer [] worldServers)`
- `public void preparePlayer( EntityPlayerMP playerIn, WorldServer worldIn)`
- `public int getEntityViewDistance()`
- `public NBTTagCompound readPlayerDataFromFile( EntityPlayerMP playerIn)`
- `public NBTTagCompound getPlayerNBT( EntityPlayerMP player)`
- `protected void writePlayerData( EntityPlayerMP playerIn)`
- `public void playerLoggedIn( EntityPlayerMP playerIn)`
- `public void serverUpdateMountedMovingPlayer( EntityPlayerMP playerIn)`
- `public void playerLoggedOut( EntityPlayerMP playerIn)`
- `public java.lang.String allowUserToConnect(java.net.SocketAddress address, GameProfile profile)`
- `public EntityPlayerMP createPlayerForUser(GameProfile profile)`
- `public EntityPlayerMP recreatePlayerEntity( EntityPlayerMP playerIn, int dimension, boolean conqueredEnd)`
- `public void transferPlayerToDimension( EntityPlayerMP playerIn, int dimension)`
- `public void transferPlayerToDimension( EntityPlayerMP playerIn, int dimension, Teleporter teleporter)`
- `public void transferEntityToWorld( Entity entityIn, int p_82448_2_, WorldServer p_82448_3_, WorldServer p_82448_4_)`
- `public void transferEntityToWorld( Entity entityIn, int p_82448_2_, WorldServer p_82448_3_, WorldServer p_82448_4_, Teleporter teleporter)`
- `public void onTick()`
- `public void sendPacketToAllPlayers( Packet packetIn)`
- `public void sendPacketToAllPlayersInDimension( Packet packetIn, int dimension)`
- `public void sendMessageToAllTeamMembers( EntityPlayer player, IChatComponent message)`
- `public void sendMessageToTeamOrEvryPlayer( EntityPlayer player, IChatComponent message)`
- `public java.lang.String func_181058_b(boolean p_181058_1_)`
- `public java.lang.String[] getAllUsernames()`
- `public GameProfile[] getAllProfiles()`
- `public UserListBans getBannedPlayers()`
- `public BanList getBannedIPs()`
- `public void addOp(GameProfile profile)`
- `public void removeOp(GameProfile profile)`
- `public boolean canJoin(GameProfile profile)`
- `public boolean canSendCommands(GameProfile profile)`
- `public EntityPlayerMP getPlayerByUsername(java.lang.String username)`
- `public void sendToAllNear(double x, double y, double z, double radius, int dimension, Packet packetIn)`
- `public void sendToAllNearExcept( EntityPlayer p_148543_1_, double x, double y, double z, double radius, int dimension, Packet p_148543_11_)`
- `public void saveAllPlayerData()`
- `public void addWhitelistedPlayer(GameProfile profile)`
- `public void removePlayerFromWhitelist(GameProfile profile)`
- `public UserListWhitelist getWhitelistedPlayers()`
- `public java.lang.String[] getWhitelistedPlayerNames()`
- `public UserListOps getOppedPlayers()`
- `public java.lang.String[] getOppedPlayerNames()`
- `public void loadWhiteList()`
- `public void updateTimeAndWeatherForPlayer( EntityPlayerMP playerIn, WorldServer worldIn)`
- `public void syncPlayerInventory( EntityPlayerMP playerIn)`
- `public int getCurrentPlayerCount()`
- `public int getMaxPlayers()`
- `public java.lang.String[] getAvailablePlayerDat()`
- `public void setWhiteListEnabled(boolean whitelistEnabled)`
- `public java.util.List< EntityPlayerMP > getPlayersMatchingAddress(java.lang.String address)`
- `public int getViewDistance()`
- `public MinecraftServer getServerInstance()`
- `public NBTTagCompound getHostPlayerData()`
- `public void setGameType( WorldSettings.GameType p_152604_1_)`
- `public void setCommandsAllowedForAll(boolean p_72387_1_)`
- `public void removeAllPlayers()`
- `public void sendChatMsgImpl( IChatComponent component, boolean isChat)`
- `public void sendChatMsg( IChatComponent component)`
- `public StatisticsFile getPlayerStatsFile( EntityPlayer playerIn)`
- `public void setViewDistance(int distance)`
- `public java.util.List< EntityPlayerMP > getPlayerList()`
- `public EntityPlayerMP getPlayerByUUID(java.util.UUID playerUUID)`
- `public boolean func_183023_f(GameProfile p_183023_1_)`
- `public boolean isWhiteListEnabled()`

## Description

The maximum number of players that can be connected at a time.