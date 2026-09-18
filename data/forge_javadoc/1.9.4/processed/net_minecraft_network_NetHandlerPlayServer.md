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
- `public void kickPlayerFromServer(java.lang.String reason)`
- `public void processInput( CPacketInput packetIn)`
- `public void processVehicleMove( CPacketVehicleMove packetIn)`
- `public void processConfirmTeleport( CPacketConfirmTeleport packetIn)`
- `public void processPlayer( CPacketPlayer packetIn)`
- `public void setPlayerLocation(double x, double y, double z, float yaw, float pitch)`
- `public void setPlayerLocation(double x, double y, double z, float yaw, float pitch, java.util.Set< SPacketPlayerPosLook.EnumFlags > relativeSet)`
- `public void processPlayerDigging( CPacketPlayerDigging packetIn)`
- `public void processRightClickBlock( CPacketPlayerTryUseItemOnBlock packetIn)`
- `public void processPlayerBlockPlacement( CPacketPlayerTryUseItem packetIn)`
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
- `public void processEnchantItem( CPacketEnchantItem packetIn)`
- `public void processCreativeInventoryAction( CPacketCreativeInventoryAction packetIn)`
- `public void processConfirmTransaction( CPacketConfirmTransaction packetIn)`
- `public void processUpdateSign( CPacketUpdateSign packetIn)`
- `public void processKeepAlive( CPacketKeepAlive packetIn)`
- `public void processPlayerAbilities( CPacketPlayerAbilities packetIn)`
- `public void processTabComplete( CPacketTabComplete packetIn)`
- `public void processClientSettings( CPacketClientSettings packetIn)`
- `public void processCustomPayload( CPacketCustomPayload packetIn)`