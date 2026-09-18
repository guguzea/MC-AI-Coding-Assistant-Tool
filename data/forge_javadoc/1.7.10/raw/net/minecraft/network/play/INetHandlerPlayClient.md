---
title: "INetHandlerPlayClient"
description: "public interface INetHandlerPlayClient extends INetHandler"
package: "net/minecraft/network/play"
version: "1.7.10"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/net/minecraft/network/play/INetHandlerPlayClient.html"
sourceType: javadoc
---

# INetHandlerPlayClient

## Class signature

```java
public interface INetHandlerPlayClient extends INetHandler
```

## Methods

- `void handleSpawnObject( S0EPacketSpawnObject p_147235_1_)`
- `void handleSpawnExperienceOrb( S11PacketSpawnExperienceOrb p_147286_1_)`
- `void handleSpawnGlobalEntity( S2CPacketSpawnGlobalEntity p_147292_1_)`
- `void handleSpawnMob( S0FPacketSpawnMob p_147281_1_)`
- `void handleScoreboardObjective( S3BPacketScoreboardObjective p_147291_1_)`
- `void handleSpawnPainting( S10PacketSpawnPainting p_147288_1_)`
- `void handleSpawnPlayer( S0CPacketSpawnPlayer p_147237_1_)`
- `void handleAnimation( S0BPacketAnimation p_147279_1_)`
- `void handleStatistics( S37PacketStatistics p_147293_1_)`
- `void handleBlockBreakAnim( S25PacketBlockBreakAnim p_147294_1_)`
- `void handleSignEditorOpen( S36PacketSignEditorOpen p_147268_1_)`
- `void handleUpdateTileEntity( S35PacketUpdateTileEntity p_147273_1_)`
- `void handleBlockAction( S24PacketBlockAction p_147261_1_)`
- `void handleBlockChange( S23PacketBlockChange p_147234_1_)`
- `void handleChat( S02PacketChat p_147251_1_)`
- `void handleTabComplete( S3APacketTabComplete p_147274_1_)`
- `void handleMultiBlockChange( S22PacketMultiBlockChange p_147287_1_)`
- `void handleMaps( S34PacketMaps p_147264_1_)`
- `void handleConfirmTransaction( S32PacketConfirmTransaction p_147239_1_)`
- `void handleCloseWindow( S2EPacketCloseWindow p_147276_1_)`
- `void handleWindowItems( S30PacketWindowItems p_147241_1_)`
- `void handleOpenWindow( S2DPacketOpenWindow p_147265_1_)`
- `void handleWindowProperty( S31PacketWindowProperty p_147245_1_)`
- `void handleSetSlot( S2FPacketSetSlot p_147266_1_)`
- `void handleCustomPayload( S3FPacketCustomPayload p_147240_1_)`
- `void handleDisconnect( S40PacketDisconnect p_147253_1_)`
- `void handleUseBed( S0APacketUseBed p_147278_1_)`
- `void handleEntityStatus( S19PacketEntityStatus p_147236_1_)`
- `void handleEntityAttach( S1BPacketEntityAttach p_147243_1_)`
- `void handleExplosion( S27PacketExplosion p_147283_1_)`
- `void handleChangeGameState( S2BPacketChangeGameState p_147252_1_)`
- `void handleKeepAlive( S00PacketKeepAlive p_147272_1_)`
- `void handleChunkData( S21PacketChunkData p_147263_1_)`
- `void handleMapChunkBulk( S26PacketMapChunkBulk p_147269_1_)`
- `void handleEffect( S28PacketEffect p_147277_1_)`
- `void handleJoinGame( S01PacketJoinGame p_147282_1_)`
- `void handleEntityMovement( S14PacketEntity p_147259_1_)`
- `void handlePlayerPosLook( S08PacketPlayerPosLook p_147258_1_)`
- `void handleParticles( S2APacketParticles p_147289_1_)`
- `void handlePlayerAbilities( S39PacketPlayerAbilities p_147270_1_)`
- `void handlePlayerListItem( S38PacketPlayerListItem p_147256_1_)`
- `void handleDestroyEntities( S13PacketDestroyEntities p_147238_1_)`
- `void handleRemoveEntityEffect( S1EPacketRemoveEntityEffect p_147262_1_)`
- `void handleRespawn( S07PacketRespawn p_147280_1_)`
- `void handleEntityHeadLook( S19PacketEntityHeadLook p_147267_1_)`
- `void handleHeldItemChange( S09PacketHeldItemChange p_147257_1_)`
- `void handleDisplayScoreboard( S3DPacketDisplayScoreboard p_147254_1_)`
- `void handleEntityMetadata( S1CPacketEntityMetadata p_147284_1_)`
- `void handleEntityVelocity( S12PacketEntityVelocity p_147244_1_)`
- `void handleEntityEquipment( S04PacketEntityEquipment p_147242_1_)`
- `void handleSetExperience( S1FPacketSetExperience p_147295_1_)`
- `void handleUpdateHealth( S06PacketUpdateHealth p_147249_1_)`
- `void handleTeams( S3EPacketTeams p_147247_1_)`
- `void handleUpdateScore( S3CPacketUpdateScore p_147250_1_)`
- `void handleSpawnPosition( S05PacketSpawnPosition p_147271_1_)`
- `void handleTimeUpdate( S03PacketTimeUpdate p_147285_1_)`
- `void handleUpdateSign( S33PacketUpdateSign p_147248_1_)`
- `void handleSoundEffect( S29PacketSoundEffect p_147255_1_)`
- `void handleCollectItem( S0DPacketCollectItem p_147246_1_)`
- `void handleEntityTeleport( S18PacketEntityTeleport p_147275_1_)`
- `void handleEntityProperties( S20PacketEntityProperties p_147290_1_)`
- `void handleEntityEffect( S1DPacketEntityEffect p_147260_1_)`
