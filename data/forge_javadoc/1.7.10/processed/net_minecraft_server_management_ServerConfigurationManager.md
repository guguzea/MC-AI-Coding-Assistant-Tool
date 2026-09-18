# ServerConfigurationManager

## Class signature

```java
public abstract class ServerConfigurationManager extends java.lang.Object
```

## Constructors

- `public ServerConfigurationManager( MinecraftServer p_i1500_1_)`

## Methods

- `public void initializeConnectionToPlayer( NetworkManager p_72355_1_, EntityPlayerMP p_72355_2_, NetHandlerPlayServer nethandlerplayserver)`
- `protected void func_96456_a( ServerScoreboard p_96456_1_, EntityPlayerMP p_96456_2_)`
- `public void setPlayerManager( WorldServer [] p_72364_1_)`
- `public void func_72375_a( EntityPlayerMP p_72375_1_, WorldServer p_72375_2_)`
- `public int getEntityViewDistance()`
- `public NBTTagCompound readPlayerDataFromFile( EntityPlayerMP p_72380_1_)`
- `public NBTTagCompound getPlayerNBT( EntityPlayerMP player)`
- `protected void writePlayerData( EntityPlayerMP p_72391_1_)`
- `public void playerLoggedIn( EntityPlayerMP p_72377_1_)`
- `public void updatePlayerPertinentChunks( EntityPlayerMP p_72358_1_)`
- `public void playerLoggedOut( EntityPlayerMP p_72367_1_)`
- `public java.lang.String allowUserToConnect(java.net.SocketAddress p_148542_1_, GameProfile p_148542_2_)`
- `public EntityPlayerMP createPlayerForUser(GameProfile p_148545_1_)`
- `public EntityPlayerMP respawnPlayer( EntityPlayerMP p_72368_1_, int p_72368_2_, boolean p_72368_3_)`
- `public void transferPlayerToDimension( EntityPlayerMP p_72356_1_, int p_72356_2_)`
- `public void transferEntityToWorld( Entity p_82448_1_, int p_82448_2_, WorldServer p_82448_3_, WorldServer p_82448_4_)`
- `public void sendPlayerInfoToAllPlayers()`
- `public void sendPacketToAllPlayers( Packet p_148540_1_)`
- `public void sendPacketToAllPlayersInDimension( Packet p_148537_1_, int p_148537_2_)`
- `public java.lang.String func_152609_b(boolean p_152609_1_)`
- `public java.lang.String[] getAllUsernames()`
- `public GameProfile[] func_152600_g()`
- `public UserListBans func_152608_h()`
- `public BanList getBannedIPs()`
- `public void func_152605_a(GameProfile p_152605_1_)`
- `public void func_152610_b(GameProfile p_152610_1_)`
- `public boolean func_152607_e(GameProfile p_152607_1_)`
- `public boolean func_152596_g(GameProfile p_152596_1_)`
- `public EntityPlayerMP func_152612_a(java.lang.String p_152612_1_)`
- `public java.util.List findPlayers( ChunkCoordinates p_82449_1_, int p_82449_2_, int p_82449_3_, int p_82449_4_, int p_82449_5_, int p_82449_6_, int p_82449_7_, java.util.Map p_82449_8_, java.lang.String p_82449_9_, java.lang.String p_82449_10_, World p_82449_11_)`
- `public void sendToAllNear(double p_148541_1_, double p_148541_3_, double p_148541_5_, double p_148541_7_, int p_148541_9_, Packet p_148541_10_)`
- `public void sendToAllNearExcept( EntityPlayer p_148543_1_, double p_148543_2_, double p_148543_4_, double p_148543_6_, double p_148543_8_, int p_148543_10_, Packet p_148543_11_)`
- `public void saveAllPlayerData()`
- `public void func_152601_d(GameProfile p_152601_1_)`
- `public void func_152597_c(GameProfile p_152597_1_)`
- `public UserListWhitelist func_152599_k()`
- `public java.lang.String[] func_152598_l()`
- `public UserListOps func_152603_m()`
- `public java.lang.String[] func_152606_n()`
- `public void loadWhiteList()`
- `public void updateTimeAndWeatherForPlayer( EntityPlayerMP p_72354_1_, WorldServer p_72354_2_)`
- `public void syncPlayerInventory( EntityPlayerMP p_72385_1_)`
- `public int getCurrentPlayerCount()`
- `public int getMaxPlayers()`
- `public java.lang.String[] getAvailablePlayerDat()`
- `public void setWhiteListEnabled(boolean p_72371_1_)`
- `public java.util.List getPlayerList(java.lang.String p_72382_1_)`
- `public int getViewDistance()`
- `public MinecraftServer getServerInstance()`
- `public NBTTagCompound getHostPlayerData()`
- `public void func_152604_a( WorldSettings.GameType p_152604_1_)`
- `public void setCommandsAllowedForAll(boolean p_72387_1_)`
- `public void removeAllPlayers()`
- `public void sendChatMsgImpl( IChatComponent p_148544_1_, boolean p_148544_2_)`
- `public void sendChatMsg( IChatComponent p_148539_1_)`
- `public StatisticsFile func_152602_a( EntityPlayer p_152602_1_)`
- `public void func_152611_a(int p_152611_1_)`
- `public boolean isWhiteListEnabled()`