# PlayerList

**Inheritance:** java.lang.Object → net.minecraft.server.management.PlayerList

## Class signature

```java
public abstract class PlayerList extends java.lang.Object
```

## Constructors

- `PlayerList(MinecraftServer server)`

## Methods

- `void addOp(com.mojang.authlib.GameProfile profile)`
- `void addWhitelistedPlayer(com.mojang.authlib.GameProfile profile)`
- `java.lang.String allowUserToConnect(java.net.SocketAddress address, com.mojang.authlib.GameProfile profile)`
- `boolean bypassesPlayerLimit(com.mojang.authlib.GameProfile profile)`
- `boolean canJoin(com.mojang.authlib.GameProfile profile)`
- `boolean canSendCommands(com.mojang.authlib.GameProfile profile)`
- `void changePlayerDimension(EntityPlayerMP player, int dimensionIn)`
- `EntityPlayerMP createPlayerForUser(com.mojang.authlib.GameProfile profile)`
- `com.mojang.authlib.GameProfile[] getAllProfiles()`
- `java.lang.String[] getAllUsernames()`
- `java.lang.String[] getAvailablePlayerDat()`
- `UserListIPBans getBannedIPs()`
- `UserListBans getBannedPlayers()`
- `int getCurrentPlayerCount()`
- `int getEntityViewDistance()`
- `java.lang.String getFormattedListOfPlayers(boolean includeUUIDs)`
- `NBTTagCompound getHostPlayerData()`
- `int getMaxPlayers()`
- `java.lang.String[] getOppedPlayerNames()`
- `UserListOps getOppedPlayers()`
- `EntityPlayerMP getPlayerByUsername(java.lang.String username)`
- `EntityPlayerMP getPlayerByUUID(java.util.UUID playerUUID)`
- `java.util.List<EntityPlayerMP> getPlayerList()`
- `NBTTagCompound getPlayerNBT(EntityPlayerMP player)`
- `java.util.List<EntityPlayerMP> getPlayersMatchingAddress(java.lang.String address)`
- `StatisticsManagerServer getPlayerStatsFile(EntityPlayer playerIn)`
- `MinecraftServer getServerInstance()`
- `int getViewDistance()`
- `java.lang.String[] getWhitelistedPlayerNames()`
- `UserListWhitelist getWhitelistedPlayers()`
- `void initializeConnectionToPlayer(NetworkManager netManager, EntityPlayerMP playerIn, NetHandlerPlayServer nethandlerplayserver)`
- `boolean isWhiteListEnabled()`
- `void onTick()`
- `void playerLoggedIn(EntityPlayerMP playerIn)`
- `void playerLoggedOut(EntityPlayerMP playerIn)`
- `void preparePlayer(EntityPlayerMP playerIn, WorldServer worldIn)`
- `NBTTagCompound readPlayerDataFromFile(EntityPlayerMP playerIn)`
- `EntityPlayerMP recreatePlayerEntity(EntityPlayerMP playerIn, int dimension, boolean conqueredEnd)`
- `void reloadWhitelist()`
- `void removeAllPlayers()`
- `void removeOp(com.mojang.authlib.GameProfile profile)`
- `void removePlayerFromWhitelist(com.mojang.authlib.GameProfile profile)`
- `void saveAllPlayerData()`
- `void sendChatMsg(ITextComponent component)`
- `void sendChatMsgImpl(ITextComponent component, boolean isSystem)`
- `void sendMessageToAllTeamMembers(EntityPlayer player, ITextComponent message)`
- `void sendMessageToTeamOrAllPlayers(EntityPlayer player, ITextComponent message)`
- `void sendPacketToAllPlayers(Packet<?> packetIn)`
- `void sendPacketToAllPlayersInDimension(Packet<?> packetIn, int dimension)`
- `protected void sendScoreboard(ServerScoreboard scoreboardIn, EntityPlayerMP playerIn)`
- `void sendToAllNearExcept(EntityPlayer except, double x, double y, double z, double radius, int dimension, Packet<?> packetIn)`
- `void serverUpdateMountedMovingPlayer(EntityPlayerMP playerIn)`
- `void setCommandsAllowedForAll(boolean p_72387_1_)`
- `void setGameType(WorldSettings.GameType gameModeIn)`
- `void setPlayerManager(WorldServer [] worldServers)`
- `void setViewDistance(int distance)`
- `void setWhiteListEnabled(boolean whitelistEnabled)`
- `void syncPlayerInventory(EntityPlayerMP playerIn)`
- `void transferEntityToWorld(Entity entityIn, int lastDimension, WorldServer oldWorldIn, WorldServer toWorldIn)`
- `void transferEntityToWorld(Entity entityIn, int lastDimension, WorldServer oldWorldIn, WorldServer toWorldIn, Teleporter teleporter)`
- `void transferPlayerToDimension(EntityPlayerMP player, int dimensionIn, Teleporter teleporter)`
- `void updatePermissionLevel(EntityPlayerMP player)`
- `void updateTimeAndWeatherForPlayer(EntityPlayerMP playerIn, WorldServer worldIn)`
- `protected void writePlayerData(EntityPlayerMP playerIn)`

## Fields

- `static java.io.File FILE_IPBANS`
- `static java.io.File FILE_OPS`
- `static java.io.File FILE_PLAYERBANS`
- `static java.io.File FILE_WHITELIST`
- `protected int maxPlayers`