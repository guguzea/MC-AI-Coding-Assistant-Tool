---
title: "ServerConfigurationManager"
description: "public abstract class ServerConfigurationManager extends java.lang.Object"
package: "net/minecraft/server/management"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/server/management/ServerConfigurationManager.html"
sourceType: javadoc
---

# ServerConfigurationManager

**Inheritance:** java.lang.Object → net.minecraft.server.management.ServerConfigurationManager

## Class signature

```java
public abstract class ServerConfigurationManager extends java.lang.Object
```

## Constructors

- `ServerConfigurationManager(MinecraftServer server)`

## Methods

- `void addOp(GameProfile profile)`
- `void addWhitelistedPlayer(GameProfile profile)`
- `java.lang.String allowUserToConnect(java.net.SocketAddress address, GameProfile profile)` — checks ban-lists, then white-lists, then space for the server.
- `boolean canJoin(GameProfile profile)`
- `boolean canSendCommands(GameProfile profile)`
- `EntityPlayerMP createPlayerForUser(GameProfile profile)` — also checks for multiple logins across servers
- `java.lang.String func_181058_b(boolean p_181058_1_)`
- `boolean func_183023_f(GameProfile p_183023_1_)`
- `GameProfile[] getAllProfiles()`
- `java.lang.String[] getAllUsernames()` — Returns an array of the usernames of all the connected players.
- `java.lang.String[] getAvailablePlayerDat()` — Returns an array of usernames for which player.dat exists for.
- `BanList getBannedIPs()`
- `UserListBans getBannedPlayers()`
- `int getCurrentPlayerCount()` — Returns the number of players currently on the server.
- `int getEntityViewDistance()`
- `NBTTagCompound getHostPlayerData()` — On integrated servers, returns the host's player data to be written to level.dat.
- `int getMaxPlayers()` — Returns the maximum number of players allowed on the server.
- `java.lang.String[] getOppedPlayerNames()`
- `UserListOps getOppedPlayers()`
- `EntityPlayerMP getPlayerByUsername(java.lang.String username)`
- `EntityPlayerMP getPlayerByUUID(java.util.UUID playerUUID)` — Get's the EntityPlayerMP object representing the player with the UUID.
- `java.util.List<EntityPlayerMP> getPlayerList()`
- `NBTTagCompound getPlayerNBT(EntityPlayerMP player)`
- `java.util.List<EntityPlayerMP> getPlayersMatchingAddress(java.lang.String address)`
- `StatisticsFile getPlayerStatsFile(EntityPlayer playerIn)`
- `MinecraftServer getServerInstance()`
- `int getViewDistance()` — Gets the View Distance.
- `java.lang.String[] getWhitelistedPlayerNames()`
- `UserListWhitelist getWhitelistedPlayers()`
- `void initializeConnectionToPlayer(NetworkManager netManager, EntityPlayerMP playerIn, NetHandlerPlayServer nethandlerplayserver)`
- `boolean isWhiteListEnabled()`
- `void loadWhiteList()` — Either does nothing, or calls readWhiteList.
- `void onTick()` — self explanitory
- `void playerLoggedIn(EntityPlayerMP playerIn)` — Called when a player successfully logs in.
- `void playerLoggedOut(EntityPlayerMP playerIn)` — Called when a player disconnects from the game.
- `void preparePlayer(EntityPlayerMP playerIn, WorldServer worldIn)`
- `NBTTagCompound readPlayerDataFromFile(EntityPlayerMP playerIn)` — called during player login. reads the player information from disk.
- `EntityPlayerMP recreatePlayerEntity(EntityPlayerMP playerIn, int dimension, boolean conqueredEnd)` — Called on respawn
- `void removeAllPlayers()` — Kicks everyone with "Server closed" as reason.
- `void removeOp(GameProfile profile)`
- `void removePlayerFromWhitelist(GameProfile profile)`
- `void saveAllPlayerData()` — Saves all of the players' current states.
- `void sendChatMsg(IChatComponent component)` — Sends the given string to every player as chat message.
- `void sendChatMsgImpl(IChatComponent component, boolean isChat)`
- `void sendMessageToAllTeamMembers(EntityPlayer player, IChatComponent message)`
- `void sendMessageToTeamOrEvryPlayer(EntityPlayer player, IChatComponent message)`
- `void sendPacketToAllPlayers(Packet packetIn)`
- `void sendPacketToAllPlayersInDimension(Packet packetIn, int dimension)`
- `protected void sendScoreboard(ServerScoreboard scoreboardIn, EntityPlayerMP playerIn)`
- `void sendToAllNear(double x, double y, double z, double radius, int dimension, Packet packetIn)` — params: x,y,z,r,dimension.
- `void sendToAllNearExcept(EntityPlayer p_148543_1_, double x, double y, double z, double radius, int dimension, Packet p_148543_11_)` — params: srcPlayer,x,y,z,r,dimension.
- `void serverUpdateMountedMovingPlayer(EntityPlayerMP playerIn)` — using player's dimension, update their movement when in a vehicle (e.g. cart, boat)
- `void setCommandsAllowedForAll(boolean p_72387_1_)` — Sets whether all players are allowed to use commands (cheats) on the server.
- `void setGameType(WorldSettings.GameType p_152604_1_)`
- `void setPlayerManager(WorldServer [] worldServers)` — Sets the NBT manager to the one for the WorldServer given.
- `void setViewDistance(int distance)`
- `void setWhiteListEnabled(boolean whitelistEnabled)`
- `void syncPlayerInventory(EntityPlayerMP playerIn)` — sends the players inventory to himself
- `void transferEntityToWorld(Entity entityIn, int p_82448_2_, WorldServer p_82448_3_, WorldServer p_82448_4_)` — Transfers an entity from a world to another world.
- `void transferEntityToWorld(Entity entityIn, int p_82448_2_, WorldServer p_82448_3_, WorldServer p_82448_4_, Teleporter teleporter)`
- `void transferPlayerToDimension(EntityPlayerMP playerIn, int dimension)` — moves provided player from overworld to nether or vice versa
- `void transferPlayerToDimension(EntityPlayerMP playerIn, int dimension, Teleporter teleporter)`
- `void updateTimeAndWeatherForPlayer(EntityPlayerMP playerIn, WorldServer worldIn)` — Updates the time and weather for the given player to those of the given world
- `protected void writePlayerData(EntityPlayerMP playerIn)` — also stores the NBTTags if this is an intergratedPlayerList

## Fields

- `static java.io.File FILE_IPBANS`
- `static java.io.File FILE_OPS`
- `static java.io.File FILE_PLAYERBANS`
- `static java.io.File FILE_WHITELIST`
- `protected int maxPlayers` — The maximum number of players that can be connected at a time.
- `java.util.List<EntityPlayerMP> playerEntityList`
- `java.util.Map<java.util.UUID, EntityPlayerMP> uuidToPlayerMap`
