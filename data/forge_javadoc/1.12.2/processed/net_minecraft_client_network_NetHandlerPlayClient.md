# NetHandlerPlayClient

## Class signature

```java
public class NetHandlerPlayClient extends java.lang.Object implements INetHandlerPlayClient
```

## Constructors

- `public NetHandlerPlayClient( Minecraft mcIn, GuiScreen p_i46300_2_, NetworkManager networkManagerIn, GameProfile profileIn)`

## Methods

- `public void cleanup()`
- `public void handleJoinGame( SPacketJoinGame packetIn)`
- `public void handleSpawnObject( SPacketSpawnObject packetIn)`
- `public void handleSpawnExperienceOrb( SPacketSpawnExperienceOrb packetIn)`
- `public void handleSpawnGlobalEntity( SPacketSpawnGlobalEntity packetIn)`
- `public void handleSpawnPainting( SPacketSpawnPainting packetIn)`
- `public void handleEntityVelocity( SPacketEntityVelocity packetIn)`
- `public void handleEntityMetadata( SPacketEntityMetadata packetIn)`
- `public void handleSpawnPlayer( SPacketSpawnPlayer packetIn)`
- `public void handleEntityTeleport( SPacketEntityTeleport packetIn)`
- `public void handleHeldItemChange( SPacketHeldItemChange packetIn)`
- `public void handleEntityMovement( SPacketEntity packetIn)`
- `public void handleEntityHeadLook( SPacketEntityHeadLook packetIn)`
- `public void handleDestroyEntities( SPacketDestroyEntities packetIn)`
- `public void handlePlayerPosLook( SPacketPlayerPosLook packetIn)`
- `public void handleMultiBlockChange( SPacketMultiBlockChange packetIn)`
- `public void handleChunkData( SPacketChunkData packetIn)`
- `public void processChunkUnload( SPacketUnloadChunk packetIn)`
- `public void handleBlockChange( SPacketBlockChange packetIn)`
- `public void handleDisconnect( SPacketDisconnect packetIn)`
- `public void onDisconnect( ITextComponent reason)`
- `public void sendPacket( Packet <?> packetIn)`
- `public void handleCollectItem( SPacketCollectItem packetIn)`
- `public void handleChat( SPacketChat packetIn)`
- `public void handleAnimation( SPacketAnimation packetIn)`
- `public void handleUseBed( SPacketUseBed packetIn)`
- `public void handleSpawnMob( SPacketSpawnMob packetIn)`
- `public void handleTimeUpdate( SPacketTimeUpdate packetIn)`
- `public void handleSpawnPosition( SPacketSpawnPosition packetIn)`
- `public void handleSetPassengers( SPacketSetPassengers packetIn)`
- `public void handleEntityAttach( SPacketEntityAttach packetIn)`
- `public void handleEntityStatus( SPacketEntityStatus packetIn)`
- `public void handleUpdateHealth( SPacketUpdateHealth packetIn)`
- `public void handleSetExperience( SPacketSetExperience packetIn)`
- `public void handleRespawn( SPacketRespawn packetIn)`
- `public void handleExplosion( SPacketExplosion packetIn)`
- `public void handleOpenWindow( SPacketOpenWindow packetIn)`
- `public void handleSetSlot( SPacketSetSlot packetIn)`
- `public void handleConfirmTransaction( SPacketConfirmTransaction packetIn)`
- `public void handleWindowItems( SPacketWindowItems packetIn)`
- `public void handleSignEditorOpen( SPacketSignEditorOpen packetIn)`
- `public void handleUpdateTileEntity( SPacketUpdateTileEntity packetIn)`
- `public void handleWindowProperty( SPacketWindowProperty packetIn)`
- `public void handleEntityEquipment( SPacketEntityEquipment packetIn)`
- `public void handleCloseWindow( SPacketCloseWindow packetIn)`
- `public void handleBlockAction( SPacketBlockAction packetIn)`
- `public void handleBlockBreakAnim( SPacketBlockBreakAnim packetIn)`
- `public void handleChangeGameState( SPacketChangeGameState packetIn)`
- `public void handleMaps( SPacketMaps packetIn)`
- `public void handleEffect( SPacketEffect packetIn)`
- `public void handleAdvancementInfo( SPacketAdvancementInfo packetIn)`
- `public void handleSelectAdvancementsTab( SPacketSelectAdvancementsTab packetIn)`
- `public void handleStatistics( SPacketStatistics packetIn)`
- `public void handleRecipeBook( SPacketRecipeBook packetIn)`
- `public void handleEntityEffect( SPacketEntityEffect packetIn)`
- `public void handleCombatEvent( SPacketCombatEvent packetIn)`
- `public void handleServerDifficulty( SPacketServerDifficulty packetIn)`
- `public void handleCamera( SPacketCamera packetIn)`
- `public void handleWorldBorder( SPacketWorldBorder packetIn)`
- `public void handleTitle( SPacketTitle packetIn)`
- `public void handlePlayerListHeaderFooter( SPacketPlayerListHeaderFooter packetIn)`
- `public void handleRemoveEntityEffect( SPacketRemoveEntityEffect packetIn)`
- `public void handlePlayerListItem( SPacketPlayerListItem packetIn)`
- `public void handleKeepAlive( SPacketKeepAlive packetIn)`
- `public void handlePlayerAbilities( SPacketPlayerAbilities packetIn)`
- `public void handleTabComplete( SPacketTabComplete packetIn)`
- `public void handleSoundEffect( SPacketSoundEffect packetIn)`
- `public void handleCustomSound( SPacketCustomSound packetIn)`
- `public void handleResourcePack( SPacketResourcePackSend packetIn)`
- `public void handleUpdateBossInfo( SPacketUpdateBossInfo packetIn)`
- `public void handleCooldown( SPacketCooldown packetIn)`
- `public void handleMoveVehicle( SPacketMoveVehicle packetIn)`
- `public void handleCustomPayload( SPacketCustomPayload packetIn)`
- `public void handleScoreboardObjective( SPacketScoreboardObjective packetIn)`
- `public void handleUpdateScore( SPacketUpdateScore packetIn)`
- `public void handleDisplayObjective( SPacketDisplayObjective packetIn)`
- `public void handleTeams( SPacketTeams packetIn)`
- `public void handleParticles( SPacketParticles packetIn)`
- `public void handleEntityProperties( SPacketEntityProperties packetIn)`
- `public void func_194307_a( SPacketPlaceGhostRecipe p_194307_1_)`
- `public NetworkManager getNetworkManager()`
- `public java.util.Collection< NetworkPlayerInfo > getPlayerInfoMap()`
- `public NetworkPlayerInfo getPlayerInfo(java.util.UUID uniqueId)`
- `public NetworkPlayerInfo getPlayerInfo(java.lang.String name)`
- `public GameProfile getGameProfile()`
- `public ClientAdvancementManager getAdvancementManager()`