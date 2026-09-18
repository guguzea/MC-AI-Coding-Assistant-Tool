# INetHandlerPlayServer

## Class signature

```java
public interface INetHandlerPlayServer extends INetHandler
```

## Methods

- `void handleAnimation( CPacketAnimation packetIn)`
- `void processChatMessage( CPacketChatMessage packetIn)`
- `void processTabComplete( CPacketTabComplete packetIn)`
- `void processClientStatus( CPacketClientStatus packetIn)`
- `void processClientSettings( CPacketClientSettings packetIn)`
- `void processConfirmTransaction( CPacketConfirmTransaction packetIn)`
- `void processEnchantItem( CPacketEnchantItem packetIn)`
- `void processClickWindow( CPacketClickWindow packetIn)`
- `void processCloseWindow( CPacketCloseWindow packetIn)`
- `void processCustomPayload( CPacketCustomPayload packetIn)`
- `void processUseEntity( CPacketUseEntity packetIn)`
- `void processKeepAlive( CPacketKeepAlive packetIn)`
- `void processPlayer( CPacketPlayer packetIn)`
- `void processPlayerAbilities( CPacketPlayerAbilities packetIn)`
- `void processPlayerDigging( CPacketPlayerDigging packetIn)`
- `void processEntityAction( CPacketEntityAction packetIn)`
- `void processInput( CPacketInput packetIn)`
- `void processHeldItemChange( CPacketHeldItemChange packetIn)`
- `void processCreativeInventoryAction( CPacketCreativeInventoryAction packetIn)`
- `void processUpdateSign( CPacketUpdateSign packetIn)`
- `void processRightClickBlock( CPacketPlayerTryUseItemOnBlock packetIn)`
- `void processPlayerBlockPlacement( CPacketPlayerTryUseItem packetIn)`
- `void handleSpectate( CPacketSpectate packetIn)`
- `void handleResourcePackStatus( CPacketResourcePackStatus packetIn)`
- `void processSteerBoat( CPacketSteerBoat packetIn)`
- `void processVehicleMove( CPacketVehicleMove packetIn)`
- `void processConfirmTeleport( CPacketConfirmTeleport packetIn)`