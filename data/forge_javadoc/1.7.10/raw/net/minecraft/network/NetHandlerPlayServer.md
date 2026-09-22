---
title: "NetHandlerPlayServer"
description: "public class NetHandlerPlayServer extends java.lang.Object implements INetHandlerPlayServer"
package: "net/minecraft/network"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/net/minecraft/network/NetHandlerPlayServer.html"
sourceType: javadoc
---

# NetHandlerPlayServer

**Inheritance:** java.lang.Object → net.minecraft.network.NetHandlerPlayServer

## Class signature

```java
public class NetHandlerPlayServer extends java.lang.Object implements INetHandlerPlayServer
```

## Constructors

- `NetHandlerPlayServer(MinecraftServer p_i1530_1_, NetworkManager p_i1530_2_, EntityPlayerMP p_i1530_3_)`

## Methods

- `NetworkManager func_147362_b()`
- `void kickPlayerFromServer(java.lang.String p_147360_1_)`
- `void onConnectionStateTransition(EnumConnectionState p_147232_1_, EnumConnectionState p_147232_2_)`
- `void onDisconnect(IChatComponent p_147231_1_)`
- `void onNetworkTick()`
- `void processAnimation(C0APacketAnimation p_147350_1_)`
- `void processChatMessage(C01PacketChatMessage p_147354_1_)`
- `void processClickWindow(C0EPacketClickWindow p_147351_1_)`
- `void processClientSettings(C15PacketClientSettings p_147352_1_)`
- `void processClientStatus(C16PacketClientStatus p_147342_1_)`
- `void processCloseWindow(C0DPacketCloseWindow p_147356_1_)`
- `void processConfirmTransaction(C0FPacketConfirmTransaction p_147339_1_)`
- `void processCreativeInventoryAction(C10PacketCreativeInventoryAction p_147344_1_)`
- `void processEnchantItem(C11PacketEnchantItem p_147338_1_)`
- `void processEntityAction(C0BPacketEntityAction p_147357_1_)`
- `void processHeldItemChange(C09PacketHeldItemChange p_147355_1_)`
- `void processInput(C0CPacketInput p_147358_1_)`
- `void processKeepAlive(C00PacketKeepAlive p_147353_1_)`
- `void processPlayer(C03PacketPlayer p_147347_1_)`
- `void processPlayerAbilities(C13PacketPlayerAbilities p_147348_1_)`
- `void processPlayerBlockPlacement(C08PacketPlayerBlockPlacement p_147346_1_)`
- `void processPlayerDigging(C07PacketPlayerDigging p_147345_1_)`
- `void processTabComplete(C14PacketTabComplete p_147341_1_)`
- `void processUpdateSign(C12PacketUpdateSign p_147343_1_)`
- `void processUseEntity(C02PacketUseEntity p_147340_1_)`
- `void processVanilla250Packet(C17PacketCustomPayload p_147349_1_)`
- `void sendPacket(Packet p_147359_1_)`
- `void setPlayerLocation(double p_147364_1_, double p_147364_3_, double p_147364_5_, float p_147364_7_, float p_147364_8_)`

## Fields

- `NetworkManager netManager`
- `EntityPlayerMP playerEntity`
