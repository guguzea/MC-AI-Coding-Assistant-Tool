# PlayerList

## Class signature

```java
public abstract class PlayerList extends java.lang.Object
```

## Constructors

- `public PlayerList( MinecraftServer server)`

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
- `public java.lang.String allowUserToConnect(java.net.SocketAddress address, com.mojang.authlib.GameProfile profile)`
- `public EntityPlayerMP createPlayerForUser(com.mojang.authlib.GameProfile profile)`
- `public EntityPlayerMP recreatePlayerEntity( EntityPlayerMP playerIn, int dimension, boolean conqueredEnd)`
- `public void updatePermissionLevel( EntityPlayerMP player)`
- `public void changePlayerDimension( EntityPlayerMP player, int dimensionIn)`
- `public void transferPlayerToDimension( EntityPlayerMP player, int dimensionIn, Teleporter teleporter)`
- `public void transferEntityToWorld( Entity entityIn, int lastDimension, WorldServer oldWorldIn, WorldServer toWorldIn)`
- `public void transferEntityToWorld( Entity entityIn, int lastDimension, WorldServer oldWorldIn, WorldServer toWorldIn, Teleporter teleporter)`
- `public void onTick()`
- `public void sendPacketToAllPlayers( Packet <?> packetIn)`
- `public void sendPacketToAllPlayersInDimension( Packet <?> packetIn, int dimension)`
- `public void sendMessageToAllTeamMembers( EntityPlayer player, ITextComponent message)`
- `public void sendMessageToTeamOrAllPlayers( EntityPlayer player, ITextComponent message)`
- `public java.lang.String getFormattedListOfPlayers(boolean includeUUIDs)`
- `public java.lang.String[] getAllUsernames()`
- `public com.mojang.authlib.GameProfile[] getAllProfiles()`
- `public UserListBans getBannedPlayers()`
- `public UserListIPBans getBannedIPs()`
- `public void addOp(com.mojang.authlib.GameProfile profile)`
- `public void removeOp(com.mojang.authlib.GameProfile profile)`
- `public boolean canJoin(com.mojang.authlib.GameProfile profile)`
- `public boolean canSendCommands(com.mojang.authlib.GameProfile profile)`
- `@Nullable public EntityPlayerMP getPlayerByUsername(java.lang.String username)`
- `public void sendToAllNearExcept(@Nullable EntityPlayer except, double x, double y, double z, double radius, int dimension, Packet <?> packetIn)`
- `public void saveAllPlayerData()`
- `public void addWhitelistedPlayer(com.mojang.authlib.GameProfile profile)`
- `public void removePlayerFromWhitelist(com.mojang.authlib.GameProfile profile)`
- `public UserListWhitelist getWhitelistedPlayers()`
- `public java.lang.String[] getWhitelistedPlayerNames()`
- `public UserListOps getOppedPlayers()`
- `public java.lang.String[] getOppedPlayerNames()`
- `public void reloadWhitelist()`
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
- `public void setGameType( GameType gameModeIn)`
- `public void setCommandsAllowedForAll(boolean p_72387_1_)`
- `public void removeAllPlayers()`
- `public void sendChatMsgImpl( ITextComponent component, boolean isSystem)`
- `public void sendChatMsg( ITextComponent component)`
- `public StatisticsManagerServer getPlayerStatsFile( EntityPlayer playerIn)`
- `public void setViewDistance(int distance)`
- `public java.util.List< EntityPlayerMP > getPlayerList()`
- `public EntityPlayerMP getPlayerByUUID(java.util.UUID playerUUID)`
- `public boolean bypassesPlayerLimit(com.mojang.authlib.GameProfile profile)`
- `public boolean isWhiteListEnabled()`