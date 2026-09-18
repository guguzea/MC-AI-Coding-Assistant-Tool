---
title: "NetHandlerPlayServer"
description: "public class NetHandlerPlayServer extends java.lang.Object implements INetHandlerPlayServer , ITickable"
package: "net/minecraft/network"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/network/NetHandlerPlayServer.html"
sourceType: javadoc
---

# NetHandlerPlayServer

## Class signature

```java
public class NetHandlerPlayServer extends java.lang.Object implements INetHandlerPlayServer , ITickable
```

## Constructors

- `public NetHandlerPlayServer( MinecraftServer server, NetworkManager networkManagerIn, EntityPlayerMP playerIn)`

## Methods

- `public void update()`
- `public NetworkManager getNetworkManager()`
- `public void disconnect( ITextComponent textComponent)`
- `public void processInput( CPacketInput packetIn)`
- `public void processVehicleMove( CPacketVehicleMove packetIn)`
- `public void processConfirmTeleport( CPacketConfirmTeleport packetIn)`
- `public void handleRecipeBookUpdate( CPacketRecipeInfo p_191984_1_)`
- `public void handleSeenAdvancements( CPacketSeenAdvancements p_194027_1_)`
- `public void processPlayer( CPacketPlayer packetIn)`
- `public void setPlayerLocation(double x, double y, double z, float yaw, float pitch)`
- `public void setPlayerLocation(double x, double y, double z, float yaw, float pitch, java.util.Set< SPacketPlayerPosLook.EnumFlags > relativeSet)`
- `public void processPlayerDigging( CPacketPlayerDigging packetIn)`
- `public void processTryUseItemOnBlock( CPacketPlayerTryUseItemOnBlock packetIn)`
- `public void processTryUseItem( CPacketPlayerTryUseItem packetIn)`
- `public void handleSpectate( CPacketSpectate packetIn)`
- `public void handleResourcePackStatus( CPacketResourcePackStatus packetIn)`
- `public void processSteerBoat( CPacketSteerBoat packetIn)`
- `public void onDisconnect( ITextComponent reason)`
- `public void sendPacket( Packet <?> packetIn)`
- `public void processHeldItemChange( CPacketHeldItemChange packetIn)`
- `public void processChatMessage( CPacketChatMessage packetIn)`
- `public void handleAnimation( CPacketAnimation packetIn)`
- `public void processEntityAction( CPacketEntityAction packetIn)`
- `public void processUseEntity( CPacketUseEntity packetIn)`
- `public void processClientStatus( CPacketClientStatus packetIn)`
- `public void processCloseWindow( CPacketCloseWindow packetIn)`
- `public void processClickWindow( CPacketClickWindow packetIn)`
- `public void func_194308_a( CPacketPlaceRecipe p_194308_1_)`
- `public void processEnchantItem( CPacketEnchantItem packetIn)`
- `public void processCreativeInventoryAction( CPacketCreativeInventoryAction packetIn)`
- `public void processConfirmTransaction( CPacketConfirmTransaction packetIn)`
- `public void processUpdateSign( CPacketUpdateSign packetIn)`
- `public void processKeepAlive( CPacketKeepAlive packetIn)`
- `public void processPlayerAbilities( CPacketPlayerAbilities packetIn)`
- `public void processTabComplete( CPacketTabComplete packetIn)`
- `public void processClientSettings( CPacketClientSettings packetIn)`
- `public void processCustomPayload( CPacketCustomPayload packetIn)`
