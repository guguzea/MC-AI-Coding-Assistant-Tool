---
title: "NetHandlerPlayClient"
description: "Clears the WorldClient instance associated with this NetHandlerPlayClient"
package: "net/minecraft/client/network"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/network/NetHandlerPlayClient.html"
sourceType: javadoc
---

# NetHandlerPlayClient

## Class signature

```java
public class NetHandlerPlayClient extends java.lang.Object implements INetHandlerPlayClient
```

## Constructors

- `public NetHandlerPlayClient( Minecraft mcIn, GuiScreen p_i46300_2_, NetworkManager p_i46300_3_, GameProfile p_i46300_4_)`

## Methods

- `public void cleanup()`
- `public void handleJoinGame( S01PacketJoinGame packetIn)`
- `public void handleSpawnObject( S0EPacketSpawnObject packetIn)`
- `public void handleSpawnExperienceOrb( S11PacketSpawnExperienceOrb packetIn)`
- `public void handleSpawnGlobalEntity( S2CPacketSpawnGlobalEntity packetIn)`
- `public void handleSpawnPainting( S10PacketSpawnPainting packetIn)`
- `public void handleEntityVelocity( S12PacketEntityVelocity packetIn)`
- `public void handleEntityMetadata( S1CPacketEntityMetadata packetIn)`
- `public void handleSpawnPlayer( S0CPacketSpawnPlayer packetIn)`
- `public void handleEntityTeleport( S18PacketEntityTeleport packetIn)`
- `public void handleHeldItemChange( S09PacketHeldItemChange packetIn)`
- `public void handleEntityMovement( S14PacketEntity packetIn)`
- `public void handleEntityHeadLook( S19PacketEntityHeadLook packetIn)`
- `public void handleDestroyEntities( S13PacketDestroyEntities packetIn)`
- `public void handlePlayerPosLook( S08PacketPlayerPosLook packetIn)`
- `public void handleMultiBlockChange( S22PacketMultiBlockChange packetIn)`
- `public void handleChunkData( S21PacketChunkData packetIn)`
- `public void handleBlockChange( S23PacketBlockChange packetIn)`
- `public void handleDisconnect( S40PacketDisconnect packetIn)`
- `public void onDisconnect( IChatComponent reason)`
- `public void addToSendQueue( Packet p_147297_1_)`
- `public void handleCollectItem( S0DPacketCollectItem packetIn)`
- `public void handleChat( S02PacketChat packetIn)`
- `public void handleAnimation( S0BPacketAnimation packetIn)`
- `public void handleUseBed( S0APacketUseBed packetIn)`
- `public void handleSpawnMob( S0FPacketSpawnMob packetIn)`
- `public void handleTimeUpdate( S03PacketTimeUpdate packetIn)`
- `public void handleSpawnPosition( S05PacketSpawnPosition packetIn)`
- `public void handleEntityAttach( S1BPacketEntityAttach packetIn)`
- `public void handleEntityStatus( S19PacketEntityStatus packetIn)`
- `public void handleUpdateHealth( S06PacketUpdateHealth packetIn)`
- `public void handleSetExperience( S1FPacketSetExperience packetIn)`
- `public void handleRespawn( S07PacketRespawn packetIn)`
- `public void handleExplosion( S27PacketExplosion packetIn)`
- `public void handleOpenWindow( S2DPacketOpenWindow packetIn)`
- `public void handleSetSlot( S2FPacketSetSlot packetIn)`
- `public void handleConfirmTransaction( S32PacketConfirmTransaction packetIn)`
- `public void handleWindowItems( S30PacketWindowItems packetIn)`
- `public void handleSignEditorOpen( S36PacketSignEditorOpen packetIn)`
- `public void handleUpdateSign( S33PacketUpdateSign packetIn)`
- `public void handleUpdateTileEntity( S35PacketUpdateTileEntity packetIn)`
- `public void handleWindowProperty( S31PacketWindowProperty packetIn)`
- `public void handleEntityEquipment( S04PacketEntityEquipment packetIn)`
- `public void handleCloseWindow( S2EPacketCloseWindow packetIn)`
- `public void handleBlockAction( S24PacketBlockAction packetIn)`
- `public void handleBlockBreakAnim( S25PacketBlockBreakAnim packetIn)`
- `public void handleMapChunkBulk( S26PacketMapChunkBulk packetIn)`
- `public void handleChangeGameState( S2BPacketChangeGameState packetIn)`
- `public void handleMaps( S34PacketMaps packetIn)`
- `public void handleEffect( S28PacketEffect packetIn)`
- `public void handleStatistics( S37PacketStatistics packetIn)`
- `public void handleEntityEffect( S1DPacketEntityEffect packetIn)`
- `public void handleCombatEvent( S42PacketCombatEvent packetIn)`
- `public void handleServerDifficulty( S41PacketServerDifficulty packetIn)`
- `public void handleCamera( S43PacketCamera packetIn)`
- `public void handleWorldBorder( S44PacketWorldBorder packetIn)`
- `public void handleTitle( S45PacketTitle packetIn)`
- `public void handleSetCompressionLevel( S46PacketSetCompressionLevel packetIn)`
- `public void handlePlayerListHeaderFooter( S47PacketPlayerListHeaderFooter packetIn)`
- `public void handleRemoveEntityEffect( S1EPacketRemoveEntityEffect packetIn)`
- `public void handlePlayerListItem( S38PacketPlayerListItem packetIn)`
- `public void handleKeepAlive( S00PacketKeepAlive packetIn)`
- `public void handlePlayerAbilities( S39PacketPlayerAbilities packetIn)`
- `public void handleTabComplete( S3APacketTabComplete packetIn)`
- `public void handleSoundEffect( S29PacketSoundEffect packetIn)`
- `public void handleResourcePack( S48PacketResourcePackSend packetIn)`
- `public void handleEntityNBT( S49PacketUpdateEntityNBT packetIn)`
- `public void handleCustomPayload( S3FPacketCustomPayload packetIn)`
- `public void handleScoreboardObjective( S3BPacketScoreboardObjective packetIn)`
- `public void handleUpdateScore( S3CPacketUpdateScore packetIn)`
- `public void handleDisplayScoreboard( S3DPacketDisplayScoreboard packetIn)`
- `public void handleTeams( S3EPacketTeams packetIn)`
- `public void handleParticles( S2APacketParticles packetIn)`
- `public void handleEntityProperties( S20PacketEntityProperties packetIn)`
- `public NetworkManager getNetworkManager()`
- `public java.util.Collection< NetworkPlayerInfo > getPlayerInfoMap()`
- `public NetworkPlayerInfo getPlayerInfo(java.util.UUID p_175102_1_)`
- `public NetworkPlayerInfo getPlayerInfo(java.lang.String p_175104_1_)`
- `public GameProfile getGameProfile()`

## Description

Clears the WorldClient instance associated with this NetHandlerPlayClient
