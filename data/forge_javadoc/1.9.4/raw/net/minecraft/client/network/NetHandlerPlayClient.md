---
title: "NetHandlerPlayClient"
description: "public class NetHandlerPlayClient extends java.lang.Object implements INetHandlerPlayClient"
package: "net/minecraft/client/network"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/client/network/NetHandlerPlayClient.html"
sourceType: javadoc
---

# NetHandlerPlayClient

**Inheritance:** java.lang.Object → net.minecraft.client.network.NetHandlerPlayClient

## Class signature

```java
public class NetHandlerPlayClient extends java.lang.Object implements INetHandlerPlayClient
```

## Constructors

- `NetHandlerPlayClient(Minecraft mcIn, GuiScreen p_i46300_2_, NetworkManager networkManagerIn, com.mojang.authlib.GameProfile profileIn)`

## Methods

- `void cleanup()`
- `com.mojang.authlib.GameProfile getGameProfile()`
- `NetworkManager getNetworkManager()`
- `NetworkPlayerInfo getPlayerInfo(java.lang.String name)`
- `NetworkPlayerInfo getPlayerInfo(java.util.UUID uniqueId)`
- `java.util.Collection<NetworkPlayerInfo> getPlayerInfoMap()`
- `void handleAnimation(SPacketAnimation packetIn)`
- `void handleBlockAction(SPacketBlockAction packetIn)`
- `void handleBlockBreakAnim(SPacketBlockBreakAnim packetIn)`
- `void handleBlockChange(SPacketBlockChange packetIn)`
- `void handleCamera(SPacketCamera packetIn)`
- `void handleChangeGameState(SPacketChangeGameState packetIn)`
- `void handleChat(SPacketChat packetIn)`
- `void handleChunkData(SPacketChunkData packetIn)`
- `void handleCloseWindow(SPacketCloseWindow packetIn)`
- `void handleCollectItem(SPacketCollectItem packetIn)`
- `void handleCombatEvent(SPacketCombatEvent packetIn)`
- `void handleConfirmTransaction(SPacketConfirmTransaction packetIn)`
- `void handleCooldown(SPacketCooldown packetIn)`
- `void handleCustomPayload(SPacketCustomPayload packetIn)`
- `void handleCustomSound(SPacketCustomSound packetIn)`
- `void handleDestroyEntities(SPacketDestroyEntities packetIn)`
- `void handleDisconnect(SPacketDisconnect packetIn)`
- `void handleDisplayObjective(SPacketDisplayObjective packetIn)`
- `void handleEffect(SPacketEffect packetIn)`
- `void handleEntityAttach(SPacketEntityAttach packetIn)`
- `void handleEntityEffect(SPacketEntityEffect packetIn)`
- `void handleEntityEquipment(SPacketEntityEquipment packetIn)`
- `void handleEntityHeadLook(SPacketEntityHeadLook packetIn)`
- `void handleEntityMetadata(SPacketEntityMetadata packetIn)`
- `void handleEntityMovement(SPacketEntity packetIn)`
- `void handleEntityProperties(SPacketEntityProperties packetIn)`
- `void handleEntityStatus(SPacketEntityStatus packetIn)`
- `void handleEntityTeleport(SPacketEntityTeleport packetIn)`
- `void handleEntityVelocity(SPacketEntityVelocity packetIn)`
- `void handleExplosion(SPacketExplosion packetIn)`
- `void handleHeldItemChange(SPacketHeldItemChange packetIn)`
- `void handleJoinGame(SPacketJoinGame packetIn)`
- `void handleKeepAlive(SPacketKeepAlive packetIn)`
- `void handleMaps(SPacketMaps packetIn)`
- `void handleMoveVehicle(SPacketMoveVehicle packetIn)`
- `void handleMultiBlockChange(SPacketMultiBlockChange packetIn)`
- `void handleOpenWindow(SPacketOpenWindow packetIn)`
- `void handleParticles(SPacketParticles packetIn)`
- `void handlePlayerAbilities(SPacketPlayerAbilities packetIn)`
- `void handlePlayerListHeaderFooter(SPacketPlayerListHeaderFooter packetIn)`
- `void handlePlayerListItem(SPacketPlayerListItem packetIn)`
- `void handlePlayerPosLook(SPacketPlayerPosLook packetIn)`
- `void handleRemoveEntityEffect(SPacketRemoveEntityEffect packetIn)`
- `void handleResourcePack(SPacketResourcePackSend packetIn)`
- `void handleRespawn(SPacketRespawn packetIn)`
- `void handleScoreboardObjective(SPacketScoreboardObjective packetIn)`
- `void handleServerDifficulty(SPacketServerDifficulty packetIn)`
- `void handleSetExperience(SPacketSetExperience packetIn)`
- `void handleSetPassengers(SPacketSetPassengers packetIn)`
- `void handleSetSlot(SPacketSetSlot packetIn)`
- `void handleSignEditorOpen(SPacketSignEditorOpen packetIn)`
- `void handleSoundEffect(SPacketSoundEffect packetIn)`
- `void handleSpawnExperienceOrb(SPacketSpawnExperienceOrb packetIn)`
- `void handleSpawnGlobalEntity(SPacketSpawnGlobalEntity packetIn)`
- `void handleSpawnMob(SPacketSpawnMob packetIn)`
- `void handleSpawnObject(SPacketSpawnObject packetIn)`
- `void handleSpawnPainting(SPacketSpawnPainting packetIn)`
- `void handleSpawnPlayer(SPacketSpawnPlayer packetIn)`
- `void handleSpawnPosition(SPacketSpawnPosition packetIn)`
- `void handleStatistics(SPacketStatistics packetIn)`
- `void handleTabComplete(SPacketTabComplete packetIn)`
- `void handleTeams(SPacketTeams packetIn)`
- `void handleTimeUpdate(SPacketTimeUpdate packetIn)`
- `void handleTitle(SPacketTitle packetIn)`
- `void handleUpdateEntityNBT(SPacketUpdateBossInfo packetIn)`
- `void handleUpdateHealth(SPacketUpdateHealth packetIn)`
- `void handleUpdateScore(SPacketUpdateScore packetIn)`
- `void handleUpdateTileEntity(SPacketUpdateTileEntity packetIn)`
- `void handleUseBed(SPacketUseBed packetIn)`
- `void handleWindowItems(SPacketWindowItems packetIn)`
- `void handleWindowProperty(SPacketWindowProperty packetIn)`
- `void handleWorldBorder(SPacketWorldBorder packetIn)`
- `void onDisconnect(ITextComponent reason)`
- `void processChunkUnload(SPacketUnloadChunk packetIn)`
- `void sendPacket(Packet<?> packetIn)`

## Fields

- `int currentServerMaxPlayers`
