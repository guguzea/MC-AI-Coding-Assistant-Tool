---
title: "INetHandlerPlayServer"
description: "public interface INetHandlerPlayServer extends INetHandler"
package: "net/minecraft/network/play"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/network/play/INetHandlerPlayServer.html"
sourceType: javadoc
---

# INetHandlerPlayServer

## Class signature

```java
public interface INetHandlerPlayServer extends INetHandler
```

## Methods

- `void func_194308_a(CPacketPlaceRecipe p_194308_1_)`
- `void handleAnimation(CPacketAnimation packetIn)`
- `void handleRecipeBookUpdate(CPacketRecipeInfo p_191984_1_)`
- `void handleResourcePackStatus(CPacketResourcePackStatus packetIn)`
- `void handleSeenAdvancements(CPacketSeenAdvancements p_194027_1_)`
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
- `void processPlayerDigging(CPacketPlayerDigging packetIn)`
- `void processSteerBoat(CPacketSteerBoat packetIn)`
- `void processTabComplete(CPacketTabComplete packetIn)`
- `void processTryUseItem(CPacketPlayerTryUseItem packetIn)`
- `void processTryUseItemOnBlock(CPacketPlayerTryUseItemOnBlock packetIn)`
- `void processUpdateSign(CPacketUpdateSign packetIn)`
- `void processUseEntity(CPacketUseEntity packetIn)`
- `void processVehicleMove(CPacketVehicleMove packetIn)`
