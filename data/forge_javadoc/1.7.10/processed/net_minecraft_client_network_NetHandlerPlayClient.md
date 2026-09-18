# NetHandlerPlayClient

## Class signature

```java
public class NetHandlerPlayClient extends java.lang.Object implements INetHandlerPlayClient
```

## Constructors

- `public NetHandlerPlayClient( Minecraft p_i45061_1_, GuiScreen p_i45061_2_, NetworkManager p_i45061_3_)`

## Methods

- `public void cleanup()`
- `public void onNetworkTick()`
- `public void handleJoinGame( S01PacketJoinGame p_147282_1_)`
- `public void handleSpawnObject( S0EPacketSpawnObject p_147235_1_)`
- `public void handleSpawnExperienceOrb( S11PacketSpawnExperienceOrb p_147286_1_)`
- `public void handleSpawnGlobalEntity( S2CPacketSpawnGlobalEntity p_147292_1_)`
- `public void handleSpawnPainting( S10PacketSpawnPainting p_147288_1_)`
- `public void handleEntityVelocity( S12PacketEntityVelocity p_147244_1_)`
- `public void handleEntityMetadata( S1CPacketEntityMetadata p_147284_1_)`
- `public void handleSpawnPlayer( S0CPacketSpawnPlayer p_147237_1_)`
- `public void handleEntityTeleport( S18PacketEntityTeleport p_147275_1_)`
- `public void handleHeldItemChange( S09PacketHeldItemChange p_147257_1_)`
- `public void handleEntityMovement( S14PacketEntity p_147259_1_)`
- `public void handleEntityHeadLook( S19PacketEntityHeadLook p_147267_1_)`
- `public void handleDestroyEntities( S13PacketDestroyEntities p_147238_1_)`
- `public void handlePlayerPosLook( S08PacketPlayerPosLook p_147258_1_)`
- `public void handleMultiBlockChange( S22PacketMultiBlockChange p_147287_1_)`
- `public void handleChunkData( S21PacketChunkData p_147263_1_)`
- `public void handleBlockChange( S23PacketBlockChange p_147234_1_)`
- `public void handleDisconnect( S40PacketDisconnect p_147253_1_)`
- `public void onDisconnect( IChatComponent p_147231_1_)`
- `public void addToSendQueue( Packet p_147297_1_)`
- `public void handleCollectItem( S0DPacketCollectItem p_147246_1_)`
- `public void handleChat( S02PacketChat p_147251_1_)`
- `public void handleAnimation( S0BPacketAnimation p_147279_1_)`
- `public void handleUseBed( S0APacketUseBed p_147278_1_)`
- `public void handleSpawnMob( S0FPacketSpawnMob p_147281_1_)`
- `public void handleTimeUpdate( S03PacketTimeUpdate p_147285_1_)`
- `public void handleSpawnPosition( S05PacketSpawnPosition p_147271_1_)`
- `public void handleEntityAttach( S1BPacketEntityAttach p_147243_1_)`
- `public void handleEntityStatus( S19PacketEntityStatus p_147236_1_)`
- `public void handleUpdateHealth( S06PacketUpdateHealth p_147249_1_)`
- `public void handleSetExperience( S1FPacketSetExperience p_147295_1_)`
- `public void handleRespawn( S07PacketRespawn p_147280_1_)`
- `public void handleExplosion( S27PacketExplosion p_147283_1_)`
- `public void handleOpenWindow( S2DPacketOpenWindow p_147265_1_)`
- `public void handleSetSlot( S2FPacketSetSlot p_147266_1_)`
- `public void handleConfirmTransaction( S32PacketConfirmTransaction p_147239_1_)`
- `public void handleWindowItems( S30PacketWindowItems p_147241_1_)`
- `public void handleSignEditorOpen( S36PacketSignEditorOpen p_147268_1_)`
- `public void handleUpdateSign( S33PacketUpdateSign p_147248_1_)`
- `public void handleUpdateTileEntity( S35PacketUpdateTileEntity p_147273_1_)`
- `public void handleWindowProperty( S31PacketWindowProperty p_147245_1_)`
- `public void handleEntityEquipment( S04PacketEntityEquipment p_147242_1_)`
- `public void handleCloseWindow( S2EPacketCloseWindow p_147276_1_)`
- `public void handleBlockAction( S24PacketBlockAction p_147261_1_)`
- `public void handleBlockBreakAnim( S25PacketBlockBreakAnim p_147294_1_)`
- `public void handleMapChunkBulk( S26PacketMapChunkBulk p_147269_1_)`
- `public void handleChangeGameState( S2BPacketChangeGameState p_147252_1_)`
- `public void handleMaps( S34PacketMaps p_147264_1_)`
- `public void handleEffect( S28PacketEffect p_147277_1_)`
- `public void handleStatistics( S37PacketStatistics p_147293_1_)`
- `public void handleEntityEffect( S1DPacketEntityEffect p_147260_1_)`
- `public void handleRemoveEntityEffect( S1EPacketRemoveEntityEffect p_147262_1_)`
- `public void handlePlayerListItem( S38PacketPlayerListItem p_147256_1_)`
- `public void handleKeepAlive( S00PacketKeepAlive p_147272_1_)`
- `public void onConnectionStateTransition( EnumConnectionState p_147232_1_, EnumConnectionState p_147232_2_)`
- `public void handlePlayerAbilities( S39PacketPlayerAbilities p_147270_1_)`
- `public void handleTabComplete( S3APacketTabComplete p_147274_1_)`
- `public void handleSoundEffect( S29PacketSoundEffect p_147255_1_)`
- `public void handleCustomPayload( S3FPacketCustomPayload p_147240_1_)`
- `public void handleScoreboardObjective( S3BPacketScoreboardObjective p_147291_1_)`
- `public void handleUpdateScore( S3CPacketUpdateScore p_147250_1_)`
- `public void handleDisplayScoreboard( S3DPacketDisplayScoreboard p_147254_1_)`
- `public void handleTeams( S3EPacketTeams p_147247_1_)`
- `public void handleParticles( S2APacketParticles p_147289_1_)`
- `public void handleEntityProperties( S20PacketEntityProperties p_147290_1_)`
- `public NetworkManager getNetworkManager()`