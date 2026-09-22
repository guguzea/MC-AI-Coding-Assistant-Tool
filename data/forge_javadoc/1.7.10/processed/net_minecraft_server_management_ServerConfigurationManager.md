# ServerConfigurationManager

**Inheritance:** java.lang.Object → net.minecraft.server.management.ServerConfigurationManager

## Class signature

```java
public abstract class ServerConfigurationManager extends java.lang.Object
```

## Constructors

- `ServerConfigurationManager(MinecraftServer p_i1500_1_)`

## Methods

- `java.lang.String allowUserToConnect(java.net.SocketAddress p_148542_1_, GameProfile p_148542_2_)`
- `EntityPlayerMP createPlayerForUser(GameProfile p_148545_1_)`
- `java.util.List findPlayers(ChunkCoordinates p_82449_1_, int p_82449_2_, int p_82449_3_, int p_82449_4_, int p_82449_5_, int p_82449_6_, int p_82449_7_, java.util.Map p_82449_8_, java.lang.String p_82449_9_, java.lang.String p_82449_10_, World p_82449_11_)`
- `boolean func_152596_g(GameProfile p_152596_1_)`
- `void func_152597_c(GameProfile p_152597_1_)`
- `java.lang.String[] func_152598_l()`
- `UserListWhitelist func_152599_k()`
- `GameProfile[] func_152600_g()`
- `void func_152601_d(GameProfile p_152601_1_)`
- `StatisticsFile func_152602_a(EntityPlayer p_152602_1_)`
- `UserListOps func_152603_m()`
- `void func_152604_a(WorldSettings.GameType p_152604_1_)`
- `void func_152605_a(GameProfile p_152605_1_)`
- `java.lang.String[] func_152606_n()`
- `boolean func_152607_e(GameProfile p_152607_1_)`
- `UserListBans func_152608_h()`
- `java.lang.String func_152609_b(boolean p_152609_1_)`
- `void func_152610_b(GameProfile p_152610_1_)`
- `void func_152611_a(int p_152611_1_)`
- `EntityPlayerMP func_152612_a(java.lang.String p_152612_1_)`
- `void func_72375_a(EntityPlayerMP p_72375_1_, WorldServer p_72375_2_)`
- `protected void func_96456_a(ServerScoreboard p_96456_1_, EntityPlayerMP p_96456_2_)`
- `java.lang.String[] getAllUsernames()`
- `java.lang.String[] getAvailablePlayerDat()`
- `BanList getBannedIPs()`
- `int getCurrentPlayerCount()`
- `int getEntityViewDistance()`
- `NBTTagCompound getHostPlayerData()`
- `int getMaxPlayers()`
- `java.util.List getPlayerList(java.lang.String p_72382_1_)`
- `NBTTagCompound getPlayerNBT(EntityPlayerMP player)`
- `MinecraftServer getServerInstance()`
- `int getViewDistance()`
- `void initializeConnectionToPlayer(NetworkManager p_72355_1_, EntityPlayerMP p_72355_2_, NetHandlerPlayServer nethandlerplayserver)`
- `boolean isWhiteListEnabled()`
- `void loadWhiteList()`
- `void playerLoggedIn(EntityPlayerMP p_72377_1_)`
- `void playerLoggedOut(EntityPlayerMP p_72367_1_)`
- `NBTTagCompound readPlayerDataFromFile(EntityPlayerMP p_72380_1_)`
- `void removeAllPlayers()`
- `EntityPlayerMP respawnPlayer(EntityPlayerMP p_72368_1_, int p_72368_2_, boolean p_72368_3_)`
- `void saveAllPlayerData()`
- `void sendChatMsg(IChatComponent p_148539_1_)`
- `void sendChatMsgImpl(IChatComponent p_148544_1_, boolean p_148544_2_)`
- `void sendPacketToAllPlayers(Packet p_148540_1_)`
- `void sendPacketToAllPlayersInDimension(Packet p_148537_1_, int p_148537_2_)`
- `void sendPlayerInfoToAllPlayers()`
- `void sendToAllNear(double p_148541_1_, double p_148541_3_, double p_148541_5_, double p_148541_7_, int p_148541_9_, Packet p_148541_10_)`
- `void sendToAllNearExcept(EntityPlayer p_148543_1_, double p_148543_2_, double p_148543_4_, double p_148543_6_, double p_148543_8_, int p_148543_10_, Packet p_148543_11_)`
- `void setCommandsAllowedForAll(boolean p_72387_1_)`
- `void setPlayerManager(WorldServer [] p_72364_1_)`
- `void setWhiteListEnabled(boolean p_72371_1_)`
- `void syncPlayerInventory(EntityPlayerMP p_72385_1_)`
- `void transferEntityToWorld(Entity p_82448_1_, int p_82448_2_, WorldServer p_82448_3_, WorldServer p_82448_4_)`
- `void transferPlayerToDimension(EntityPlayerMP p_72356_1_, int p_72356_2_)`
- `void updatePlayerPertinentChunks(EntityPlayerMP p_72358_1_)`
- `void updateTimeAndWeatherForPlayer(EntityPlayerMP p_72354_1_, WorldServer p_72354_2_)`
- `protected void writePlayerData(EntityPlayerMP p_72391_1_)`

## Fields

- `static java.io.File field_152613_a`
- `static java.io.File field_152614_b`
- `static java.io.File field_152615_c`
- `static java.io.File field_152616_d`
- `protected int maxPlayers`
- `java.util.List playerEntityList`