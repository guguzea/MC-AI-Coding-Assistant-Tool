---
title: "NetHandlerPlayServer"
description: "public class NetHandlerPlayServer extends java.lang.Object implements INetHandlerPlayServer, ITickable"
package: "net/minecraft/network"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/network/NetHandlerPlayServer.html"
sourceType: javadoc
---

# NetHandlerPlayServer

**Inheritance:** java.lang.Object → net.minecraft.network.NetHandlerPlayServer

## Class signature

```java
public class NetHandlerPlayServer extends java.lang.Object implements INetHandlerPlayServer, ITickable
```

## Constructors

- `NetHandlerPlayServer(MinecraftServer server, NetworkManager networkManagerIn, EntityPlayerMP playerIn)`

## Methods

- `void disconnect(java.lang.String reason)`
- `NetworkManager getNetworkManager()`
- `void handleAnimation(CPacketAnimation packetIn)`
- `void handleResourcePackStatus(CPacketResourcePackStatus packetIn)`
- `void handleSpectate(CPacketSpectate packetIn)`
- `void onDisconnect(ITextComponent reason)`
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
- `void sendPacket(Packet<?> packetIn)`
- `void setPlayerLocation(double x, double y, double z, float yaw, float pitch)`
- `void setPlayerLocation(double x, double y, double z, float yaw, float pitch, java.util.Set<SPacketPlayerPosLook.EnumFlags> relativeSet)`
- `void update()`

## Fields

- `NetworkManager netManager`
- `EntityPlayerMP playerEntity`
