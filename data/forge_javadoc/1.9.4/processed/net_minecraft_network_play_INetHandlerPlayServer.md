# INetHandlerPlayServer

## Class signature

```java
public interface INetHandlerPlayServer extends INetHandler
```

## Methods

- `void handleAnimation(CPacketAnimation packetIn)`
- `void handleResourcePackStatus(CPacketResourcePackStatus packetIn)`
- `void handleSpectate(CPacketSpectate packetIn)`
- `void processChatMessage(CPacketChatMessage packetIn)`
- `void processClickWindow(CPacketClickWindow packetIn)`
- `void processClientSettings(CPacketClientSettings packetIn)`
- `void processClientStatus(CPacketClientStatus packetIn)`
- `void processCloseWindow(CPacketCloseWindow packetIn)`
- `void processConfirmTeleport(CPacketConfirmTeleport packetIn)`
- `void processConfirmTransaction(CPacketConfirmTransaction packetIn)`
- `void processCreativeInventoryAction(CPacketCreativeInventoryAction packetIn)`
- `void processCustomPayload(CPacketCustomPayload packetIn)`
- `void processEnchantItem(CPacketEnchantItem packetIn)`
- `void processEntityAction(CPacketEntityAction packetIn)`
- `void processHeldItemChange(CPacketHeldItemChange packetIn)`
- `void processInput(CPacketInput packetIn)`
- `void processKeepAlive(CPacketKeepAlive packetIn)`
- `void processPlayer(CPacketPlayer packetIn)`
- `void processPlayerAbilities(CPacketPlayerAbilities packetIn)`
- `void processPlayerBlockPlacement(CPacketPlayerTryUseItem packetIn)`
- `void processPlayerDigging(CPacketPlayerDigging packetIn)`
- `void processRightClickBlock(CPacketPlayerTryUseItemOnBlock packetIn)`
- `void processSteerBoat(CPacketSteerBoat packetIn)`
- `void processTabComplete(CPacketTabComplete packetIn)`
- `void processUpdateSign(CPacketUpdateSign packetIn)`
- `void processUseEntity(CPacketUseEntity packetIn)`
- `void processVehicleMove(CPacketVehicleMove packetIn)`