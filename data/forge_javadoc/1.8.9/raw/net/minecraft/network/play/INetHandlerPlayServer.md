---
title: "INetHandlerPlayServer"
description: "public interface INetHandlerPlayServer extends INetHandler"
package: "net/minecraft/network/play"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/INetHandlerPlayServer.html"
sourceType: javadoc
---

# INetHandlerPlayServer

## Class signature

```java
public interface INetHandlerPlayServer extends INetHandler
```

## Methods

- `void handleAnimation(C0APacketAnimation packetIn)`
- `void handleResourcePackStatus(C19PacketResourcePackStatus packetIn)`
- `void handleSpectate(C18PacketSpectate packetIn)`
- `void processChatMessage(C01PacketChatMessage packetIn)` — Process chat messages (broadcast back to clients) and commands (executes)
- `void processClickWindow(C0EPacketClickWindow packetIn)` — Executes a container/inventory slot manipulation as indicated by the packet.
- `void processClientSettings(C15PacketClientSettings packetIn)` — Updates serverside copy of client settings: language, render distance, chat visibility, chat colours, difficulty, and whether to show the cape
- `void processClientStatus(C16PacketClientStatus packetIn)` — Processes the client status updates: respawn attempt from player, opening statistics or achievements, or acquiring 'open inventory' achievement
- `void processCloseWindow(C0DPacketCloseWindow packetIn)` — Processes the client closing windows (container)
- `void processConfirmTransaction(C0FPacketConfirmTransaction packetIn)` — Received in response to the server requesting to confirm that the client-side open container matches the servers' after a mismatched container-slot manipulation.
- `void processCreativeInventoryAction(C10PacketCreativeInventoryAction packetIn)` — Update the server with an ItemStack in a slot.
- `void processEnchantItem(C11PacketEnchantItem packetIn)` — Enchants the item identified by the packet given some convoluted conditions (matching window, which should/shouldn't be in use?)
- `void processEntityAction(C0BPacketEntityAction packetIn)` — Processes a range of action-types: sneaking, sprinting, waking from sleep, opening the inventory or setting jump height of the horse the player is riding
- `void processHeldItemChange(C09PacketHeldItemChange packetIn)` — Updates which quickbar slot is selected
- `void processInput(C0CPacketInput packetIn)` — Processes player movement input.
- `void processKeepAlive(C00PacketKeepAlive packetIn)` — Updates a players' ping statistics
- `void processPlayer(C03PacketPlayer packetIn)` — Processes clients perspective on player positioning and/or orientation
- `void processPlayerAbilities(C13PacketPlayerAbilities packetIn)` — Processes a player starting/stopping flying
- `void processPlayerBlockPlacement(C08PacketPlayerBlockPlacement packetIn)` — Processes block placement and block activation (anvil, furnace, etc.)
- `void processPlayerDigging(C07PacketPlayerDigging packetIn)` — Processes the player initiating/stopping digging on a particular spot, as well as a player dropping items?.
- `void processTabComplete(C14PacketTabComplete packetIn)` — Retrieves possible tab completions for the requested command string and sends them to the client
- `void processUpdateSign(C12PacketUpdateSign packetIn)`
- `void processUseEntity(C02PacketUseEntity packetIn)` — Processes interactions ((un)leashing, opening command block GUI) and attacks on an entity with players currently equipped item
- `void processVanilla250Packet(C17PacketCustomPayload packetIn)` — Synchronizes serverside and clientside book contents and signing
