---
title: "INetHandlerPlayClient"
description: "public interface INetHandlerPlayClient extends INetHandler"
package: "net/minecraft/network/play"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/INetHandlerPlayClient.html"
sourceType: javadoc
---

# INetHandlerPlayClient

## Class signature

```java
public interface INetHandlerPlayClient extends INetHandler
```

## Methods

- `void handleAnimation(S0BPacketAnimation packetIn)` — Renders a specified animation: Waking up a player, a living entity swinging its currently held item, being hurt or receiving a critical hit by normal or magical means
- `void handleBlockAction(S24PacketBlockAction packetIn)` — Triggers Block.onBlockEventReceived, which is implemented in BlockPistonBase for extension/retraction, BlockNote for setting the instrument (including audiovisual feedback) and in BlockContainer to set the number of players accessing a (Ender)Chest
- `void handleBlockBreakAnim(S25PacketBlockBreakAnim packetIn)` — Updates all registered IWorldAccess instances with destroyBlockInWorldPartially
- `void handleBlockChange(S23PacketBlockChange packetIn)` — Updates the block and metadata and generates a blockupdate (and notify the clients)
- `void handleCamera(S43PacketCamera packetIn)`
- `void handleChangeGameState(S2BPacketChangeGameState packetIn)`
- `void handleChat(S02PacketChat packetIn)` — Prints a chatmessage in the chat GUI
- `void handleChunkData(S21PacketChunkData packetIn)` — Updates the specified chunk with the supplied data, marks it for re-rendering and lighting recalculation
- `void handleCloseWindow(S2EPacketCloseWindow packetIn)` — Resets the ItemStack held in hand and closes the window that is opened
- `void handleCollectItem(S0DPacketCollectItem packetIn)`
- `void handleCombatEvent(S42PacketCombatEvent packetIn)`
- `void handleConfirmTransaction(S32PacketConfirmTransaction packetIn)` — Verifies that the server and client are synchronized with respect to the inventory/container opened by the player and confirms if it is the case.
- `void handleCustomPayload(S3FPacketCustomPayload packetIn)` — Handles packets that have room for a channel specification.
- `void handleDestroyEntities(S13PacketDestroyEntities packetIn)` — Locally eliminates the entities.
- `void handleDisconnect(S40PacketDisconnect packetIn)` — Closes the network channel
- `void handleDisplayScoreboard(S3DPacketDisplayScoreboard packetIn)` — Removes or sets the ScoreObjective to be displayed at a particular scoreboard position (list, sidebar, below name)
- `void handleEffect(S28PacketEffect packetIn)`
- `void handleEntityAttach(S1BPacketEntityAttach packetIn)`
- `void handleEntityEffect(S1DPacketEntityEffect packetIn)`
- `void handleEntityEquipment(S04PacketEntityEquipment packetIn)`
- `void handleEntityHeadLook(S19PacketEntityHeadLook packetIn)` — Updates the direction in which the specified entity is looking, normally this head rotation is independent of the rotation of the entity itself
- `void handleEntityMetadata(S1CPacketEntityMetadata packetIn)` — Invoked when the server registers new proximate objects in your watchlist or when objects in your watchlist have changed -> Registers any changes locally
- `void handleEntityMovement(S14PacketEntity packetIn)` — Updates the specified entity's position by the specified relative moment and absolute rotation.
- `void handleEntityNBT(S49PacketUpdateEntityNBT packetIn)`
- `void handleEntityProperties(S20PacketEntityProperties packetIn)` — Updates en entity's attributes and their respective modifiers, which are used for speed bonusses (player sprinting, animals fleeing, baby speed), weapon/tool attackDamage, hostiles followRange randomization, zombie maxHealth and knockback resistance as well as reinforcement spawning chance.
- `void handleEntityStatus(S19PacketEntityStatus packetIn)` — Invokes the entities' handleUpdateHealth method which is implemented in LivingBase (hurt/death), MinecartMobSpawner (spawn delay), FireworkRocket & MinecartTNT (explosion), IronGolem (throwing,...), Witch (spawn particles), Zombie (villager transformation), Animal (breeding mode particles), Horse (b
- `void handleEntityTeleport(S18PacketEntityTeleport packetIn)` — Updates an entity's position and rotation as specified by the packet
- `void handleEntityVelocity(S12PacketEntityVelocity packetIn)` — Sets the velocity of the specified entity to the specified value
- `void handleExplosion(S27PacketExplosion packetIn)` — Initiates a new explosion (sound, particles, drop spawn) for the affected blocks indicated by the packet.
- `void handleHeldItemChange(S09PacketHeldItemChange packetIn)` — Updates which hotbar slot of the player is currently selected
- `void handleJoinGame(S01PacketJoinGame packetIn)` — Registers some server properties (gametype,hardcore-mode,terraintype,difficulty,player limit), creates a new WorldClient and sets the player initial dimension
- `void handleKeepAlive(S00PacketKeepAlive packetIn)`
- `void handleMapChunkBulk(S26PacketMapChunkBulk packetIn)`
- `void handleMaps(S34PacketMaps packetIn)` — Updates the worlds MapStorage with the specified MapData for the specified map-identifier and invokes a MapItemRenderer for it
- `void handleMultiBlockChange(S22PacketMultiBlockChange packetIn)` — Received from the servers PlayerManager if between 1 and 64 blocks in a chunk are changed.
- `void handleOpenWindow(S2DPacketOpenWindow packetIn)` — Displays a GUI by ID.
- `void handleParticles(S2APacketParticles packetIn)` — Spawns a specified number of particles at the specified location with a randomized displacement according to specified bounds
- `void handlePlayerAbilities(S39PacketPlayerAbilities packetIn)`
- `void handlePlayerListHeaderFooter(S47PacketPlayerListHeaderFooter packetIn)`
- `void handlePlayerListItem(S38PacketPlayerListItem packetIn)`
- `void handlePlayerPosLook(S08PacketPlayerPosLook packetIn)` — Handles changes in player positioning and rotation such as when travelling to a new dimension, (re)spawning, mounting horses etc.
- `void handleRemoveEntityEffect(S1EPacketRemoveEntityEffect packetIn)`
- `void handleResourcePack(S48PacketResourcePackSend packetIn)`
- `void handleRespawn(S07PacketRespawn packetIn)`
- `void handleScoreboardObjective(S3BPacketScoreboardObjective packetIn)` — May create a scoreboard objective, remove an objective from the scoreboard or update an objectives' displayname
- `void handleServerDifficulty(S41PacketServerDifficulty packetIn)`
- `void handleSetCompressionLevel(S46PacketSetCompressionLevel packetIn)`
- `void handleSetExperience(S1FPacketSetExperience packetIn)`
- `void handleSetSlot(S2FPacketSetSlot packetIn)` — Handles pickin up an ItemStack or dropping one in your inventory or an open (non-creative) container
- `void handleSignEditorOpen(S36PacketSignEditorOpen packetIn)` — Creates a sign in the specified location if it didn't exist and opens the GUI to edit its text
- `void handleSoundEffect(S29PacketSoundEffect packetIn)`
- `void handleSpawnExperienceOrb(S11PacketSpawnExperienceOrb packetIn)` — Spawns an experience orb and sets its value (amount of XP)
- `void handleSpawnGlobalEntity(S2CPacketSpawnGlobalEntity packetIn)` — Handles globally visible entities.
- `void handleSpawnMob(S0FPacketSpawnMob packetIn)` — Spawns the mob entity at the specified location, with the specified rotation, momentum and type.
- `void handleSpawnObject(S0EPacketSpawnObject packetIn)` — Spawns an instance of the objecttype indicated by the packet and sets its position and momentum
- `void handleSpawnPainting(S10PacketSpawnPainting packetIn)` — Handles the spawning of a painting object
- `void handleSpawnPlayer(S0CPacketSpawnPlayer packetIn)` — Handles the creation of a nearby player entity, sets the position and held item
- `void handleSpawnPosition(S05PacketSpawnPosition packetIn)`
- `void handleStatistics(S37PacketStatistics packetIn)` — Updates the players statistics or achievements
- `void handleTabComplete(S3APacketTabComplete packetIn)` — Displays the available command-completion options the server knows of
- `void handleTeams(S3EPacketTeams packetIn)` — Updates a team managed by the scoreboard: Create/Remove the team registration, Register/Remove the player-team- memberships, Set team displayname/prefix/suffix and/or whether friendly fire is enabled
- `void handleTimeUpdate(S03PacketTimeUpdate packetIn)`
- `void handleTitle(S45PacketTitle packetIn)`
- `void handleUpdateHealth(S06PacketUpdateHealth packetIn)`
- `void handleUpdateScore(S3CPacketUpdateScore packetIn)` — Either updates the score with a specified value or removes the score for an objective
- `void handleUpdateSign(S33PacketUpdateSign packetIn)` — Updates a specified sign with the specified text lines
- `void handleUpdateTileEntity(S35PacketUpdateTileEntity packetIn)` — Updates the NBTTagCompound metadata of instances of the following entitytypes: Mob spawners, command blocks, beacons, skulls, flowerpot
- `void handleUseBed(S0APacketUseBed packetIn)` — Retrieves the player identified by the packet, puts him to sleep if possible (and flags whether all players are asleep)
- `void handleWindowItems(S30PacketWindowItems packetIn)` — Handles the placement of a specified ItemStack in a specified container/inventory slot
- `void handleWindowProperty(S31PacketWindowProperty packetIn)` — Sets the progressbar of the opened window to the specified value
- `void handleWorldBorder(S44PacketWorldBorder packetIn)`
