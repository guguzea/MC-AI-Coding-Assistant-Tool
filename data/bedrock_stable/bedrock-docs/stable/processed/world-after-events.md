> 来源：https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/worldafterevents?view=minecraft-bedrock-stable
> 抓取时间：2026-08-14T18:35:33.933Z
> 警告：此文档可能滞后于当前正式版

minecraft/server.WorldAfterEvents Class | Microsoft Learn
			Skip to main content
			Skip to Ask Learn chat experience
					 This browser is no longer supported.
						Upgrade to Microsoft Edge to take advantage of the latest features, security updates, and technical support.
							Download Microsoft Edge
							More info about Internet Explorer and Microsoft Edge
				  Table of contents
				 Exit editor mode
			 Ask Learn
			 Ask Learn
			 Reading mode
			 Table of contents
			 Read in English
			 Add
			 Add to Plans
			 Edit
					 Copy Markdown
					 Print
						 Note
						Access to this page requires authorization. You can try  signing in  or  changing directories .
						Access to this page requires authorization. You can try  changing directories .
					  WorldAfterEvents Class
			 Feedback
						Summarize this article for me
				In this article
					  Contains a set of events that are available across the scope of the World.
 Properties
  blockContainerClosed
  read-only blockContainerClosed: BlockContainerClosedAfterEventSignal;
 This event fires when a block container is closed.
 Type:   BlockContainerClosedAfterEventSignal
 Notes:
 This property can be read in early-execution mode.
  blockContainerOpened
  read-only blockContainerOpened: BlockContainerOpenedAfterEventSignal;
 This event fires when a block container is opened.
 Type:   BlockContainerOpenedAfterEventSignal
 Notes:
 This property can be read in early-execution mode.
  blockExplode
  read-only blockExplode: BlockExplodeAfterEventSignal;
 This event fires for each BlockLocation destroyed by an explosion. It is fired after the blocks have already been destroyed.
 Type:   BlockExplodeAfterEventSignal
 Notes:
 This property can be read in early-execution mode.
  buttonPush
  read-only buttonPush: ButtonPushAfterEventSignal;
 This event fires when a button is pushed.
 Type:   ButtonPushAfterEventSignal
 Notes:
 This property can be read in early-execution mode.
  chatSend
  read-only chatSend: ChatSendAfterEventSignal;
 This event is triggered after a chat message has been broadcast or sent to players.
 Type:   ChatSendAfterEventSignal
 Caution
 This property is still in pre-release.  Its signature may change or it may be removed in future releases.
 Notes:
 This property can be read in early-execution mode.
  dataDrivenEntityTrigger
  read-only dataDrivenEntityTrigger: DataDrivenEntityTriggerAfterEventSignal;
 This event is fired when an entity event has been triggered that will update the component definition state of an entity.
 Type:   DataDrivenEntityTriggerAfterEventSignal
 Notes:
 This property can be read in early-execution mode.
  effectAdd
  read-only effectAdd: EffectAddAfterEventSignal;
 This event fires when an effect, like poisoning, is added to an entity.
 Type:   EffectAddAfterEventSignal
 Notes:
 This property can be read in early-execution mode.
  entityContainerClosed
  read-only entityContainerClosed: EntityContainerClosedAfterEventSignal;
 This event fires when an entity container is closed.
 Type:   EntityContainerClosedAfterEventSignal
 Notes:
 This property can be read in early-execution mode.
  entityContainerOpened
  read-only entityContainerOpened: EntityContainerOpenedAfterEventSignal;
 This event fires when an entity container is opened.
 Type:   EntityContainerOpenedAfterEventSignal
 Notes:
 This property can be read in early-execution mode.
  entityDie
  read-only entityDie: EntityDieAfterEventSignal;
 This event fires when an entity dies.
 Type:   EntityDieAfterEventSignal
 Notes:
 This property can be read in early-execution mode.
  entityHeal
  read-only entityHeal: EntityHealAfterEventSignal;
 Type:   EntityHealAfterEventSignal
 Notes:
 This property can be read in early-execution mode.
  entityHealthChanged
  read-only entityHealthChanged: EntityHealthChangedAfterEventSignal;
 This event fires when entity health changes in any degree.
 Type:   EntityHealthChangedAfterEventSignal
 Notes:
 This property can be read in early-execution mode.
  entityHitBlock
  read-only entityHitBlock: EntityHitBlockAfterEventSignal;
 This event fires when an entity hits (that is, melee attacks) a block.
 Type:   EntityHitBlockAfterEventSignal
 Notes:
 This property can be read in early-execution mode.
  entityHitEntity
  read-only entityHitEntity: EntityHitEntityAfterEventSignal;
 This event fires when an entity hits (that is, melee attacks) another entity.
 Type:   EntityHitEntityAfterEventSignal
 Notes:
 This property can be read in early-execution mode.
  entityHurt
  read-only entityHurt: EntityHurtAfterEventSignal;
 This event fires when an entity is hurt (takes damage).
 Type:   EntityHurtAfterEventSignal
 Notes:
 This property can be read in early-execution mode.
  entityItemDrop
  read-only entityItemDrop: EntityItemDropAfterEventSignal;
 This event fires when an entity drops items.
 Type:   EntityItemDropAfterEventSignal
 Notes:
 This property can be read in early-execution mode.
  entityItemPickup
  read-only entityItemPickup: EntityItemPickupAfterEventSignal;
 This event fires when an entity picks up items.
 Type:   EntityItemPickupAfterEventSignal
 Notes:
 This property can be read in early-execution mode.
  entityLoad
  read-only entityLoad: EntityLoadAfterEventSignal;
 Fires when an entity is loaded.
 Type:   EntityLoadAfterEventSignal
 Notes:
 This property can be read in early-execution mode.
  entityRemove
  read-only entityRemove: EntityRemoveAfterEventSignal;
 Fires when an entity is removed (for example, potentially unloaded, or removed after being killed).
 Type:   EntityRemoveAfterEventSignal
 Notes:
 This property can be read in early-execution mode.
  entitySpawn
  read-only entitySpawn: EntitySpawnAfterEventSignal;
 This event fires when an entity is spawned.
 Type:   EntitySpawnAfterEventSignal
 Notes:
 This property can be read in early-execution mode.
  entityStartSneaking
  read-only entityStartSneaking: EntityStartSneakingAfterEventSignal;
 This event fires when an entity starts sneaking.
 Type:   EntityStartSneakingAfterEventSignal
 Caution
 This property is still in pre-release.  Its signature may change or it may be removed in future releases.
 Notes:
 This property can be read in early-execution mode.
  entityStopSneaking
  read-only entityStopSneaking: EntityStopSneakingAfterEventSignal;
 This event fires when an entity stops sneaking.
 Type:   EntityStopSneakingAfterEventSignal
 Caution
 This property is still in pre-release.  Its signature may change or it may be removed in future releases.
 Notes:
 This property can be read in early-execution mode.
  entityTamed
  read-only entityTamed: EntityTamedAfterEventSignal;
 This event fires when an entity is tamed.
 Type:   EntityTamedAfterEventSignal
 Caution
 This property is still in pre-release.  Its signature may change or it may be removed in future releases.
 Notes:
 This property can be read in early-execution mode.
  entityUpgrade
  read-only entityUpgrade: EntityUpgradeAfterEventSignal;
 Type:   EntityUpgradeAfterEventSignal
 Notes:
 This property can be read in early-execution mode.
  explosion
  read-only explosion: ExplosionAfterEventSignal;
 This event is fired after an explosion occurs.
 Type:   ExplosionAfterEventSignal
 Notes:
 This property can be read in early-execution mode.
  gameRuleChange
  read-only gameRuleChange: GameRuleChangeAfterEventSignal;
 This event fires when a world.gameRules property has changed.
 Type:   GameRuleChangeAfterEventSignal
 Notes:
 This property can be read in early-execution mode.
  itemCompleteUse
  read-only itemCompleteUse: ItemCompleteUseAfterEventSignal;
 This event fires when a chargeable item completes charging.
 Type:   ItemCompleteUseAfterEventSignal
 Notes:
 This property can be read in early-execution mode.
  itemReleaseUse
  read-only itemReleaseUse: ItemReleaseUseAfterEventSignal;
 This event fires when a chargeable item is released from charging.
 Type:   ItemReleaseUseAfterEventSignal
 Notes:
 This property can be read in early-execution mode.
  itemStartUse
  read-only itemStartUse: ItemStartUseAfterEventSignal;
 This event fires when a chargeable item starts charging.
 Type:   ItemStartUseAfterEventSignal
 Notes:
 This property can be read in early-execution mode.
  itemStartUseOn
  read-only itemStartUseOn: ItemStartUseOnAfterEventSignal;
 This event fires when a player successfully uses an item or places a block by pressing the Use Item / Place Block button. If multiple blocks are placed, this event will only occur once at the beginning of the block placement. Note: This event cannot be used with Hoe or Axe items.
 Type:   ItemStartUseOnAfterEventSignal
 Notes:
 This property can be read in early-execution mode.
  itemStopUse
  read-only itemStopUse: ItemStopUseAfterEventSignal;
 This event fires when a chargeable item stops charging.
 Type:   ItemStopUseAfterEventSignal
 Notes:
 This property can be read in early-execution mode.
  itemStopUseOn
  read-only itemStopUseOn: ItemStopUseOnAfterEventSignal;
 This event fires when a player releases the Use Item / Place Block button after successfully using an item. Note: This event cannot be used with Hoe or Axe items.
 Type:   ItemStopUseOnAfterEventSignal
 Notes:
 This property can be read in early-execution mode.
  itemUse
  read-only itemUse: ItemUseAfterEventSignal;
 This event fires when an item is successfully used by a player.
 Type:   ItemUseAfterEventSignal
 Notes:
 This property can be read in early-execution mode.
  leverAction
  read-only leverAction: LeverActionAfterEventSignal;
 A lever has been pulled.
 Type:   LeverActionAfterEventSignal
 Notes:
 This property can be read in early-execution mode.
  messageReceive
  read-only messageReceive: ServerMessageAfterEventSignal;
 This event is an internal implementation detail, and is otherwise not currently functional.
 Type:   ServerMessageAfterEventSignal
 Caution
 This property is still in pre-release.  Its signature may change or it may be removed in future releases.
 Notes:
 This property can be read in early-execution mode.
  packSettingChange
  read-only packSettingChange: PackSettingChangeAfterEventSignal;
 This event is triggered when a pack setting is changed.
 Type:   PackSettingChangeAfterEventSignal
 Caution
 This property is still in pre-release.  Its signature may change or it may be removed in future releases.
 Notes:
 This property can be read in early-execution mode.
  pistonActivate
  read-only pistonActivate: PistonActivateAfterEventSignal;
 This event fires when a piston expands or retracts.
 Type:   PistonActivateAfterEventSignal
 Notes:
 This property can be read in early-execution mode.
  playerBreakBlock
  read-only playerBreakBlock: PlayerBreakBlockAfterEventSignal;
 This event fires for a block that is broken by a player.
 Type:   PlayerBreakBlockAfterEventSignal
 Notes:
 This property can be read in early-execution mode.
  playerButtonInput
  read-only playerButtonInput: PlayerButtonInputAfterEventSignal;
 This event fires when an   @minecraft/server.InputButton   state is changed.
 Type:   PlayerButtonInputAfterEventSignal
 Notes:
 This property can be read in early-execution mode.
  playerCancelBreakingBlock
  read-only playerCancelBreakingBlock: PlayerCancelBreakingBlockAfterEventSignal;
 This event fires when a player cancels breaking a block.
 Type:   PlayerCancelBreakingBlockAfterEventSignal
 Notes:
 This property can be read in early-execution mode.
  playerDimensionChange
  read-only playerDimensionChange: PlayerDimensionChangeAfterEventSignal;
 Fires when a player moved to a different dimension.
 Type:   PlayerDimensionChangeAfterEventSignal
 Notes:
 This property can be read in early-execution mode.
  playerEmote
  read-only playerEmote: PlayerEmoteAfterEventSignal;
 Type:   PlayerEmoteAfterEventSignal
 Notes:
 This property can be read in early-execution mode.
  playerGameModeChange
  read-only playerGameModeChange: PlayerGameModeChangeAfterEventSignal;
 Type:   PlayerGameModeChangeAfterEventSignal
 Notes:
 This property can be read in early-execution mode.
  playerHotbarSelectedSlotChange
  read-only playerHotbarSelectedSlotChange: PlayerHotbarSelectedSlotChangeAfterEventSignal;
 This event fires when a player's selected slot changes.
 Type:   PlayerHotbarSelectedSlotChangeAfterEventSignal
 Notes:
 This property can be read in early-execution mode.
  playerInputModeChange
  read-only playerInputModeChange: PlayerInputModeChangeAfterEventSignal;
 This event fires when a player's   @minecraft/server.InputMode   changes.
 Type:   PlayerInputModeChangeAfterEventSignal
 Notes:
 This property can be read in early-execution mode.
  playerInputPermissionCategoryChange
  read-only playerInputPermissionCategoryChange: PlayerInputPermissionCategoryChangeAfterEventSignal;
 This event fires when a players input permissions change.
 Type:   PlayerInputPermissionCategoryChangeAfterEventSignal
 Notes:
 This property can be read in early-execution mode.
  playerInteractWithBlock
  read-only playerInteractWithBlock: PlayerInteractWithBlockAfterEventSignal;
 An event for when a player interacts with a block.
 Type:   PlayerInteractWithBlockAfterEventSignal
 Notes:
 This property can be read in early-execution mode.
  playerInteractWithEntity
  read-only playerInteractWithEntity: PlayerInteractWithEntityAfterEventSignal;
 This event fires when a player interacts with an entity.
 Type:   PlayerInteractWithEntityAfterEventSignal
 Notes:
 This property can be read in early-execution mode.
  playerInventoryItemChange
  read-only playerInventoryItemChange: PlayerInventoryItemChangeAfterEventSignal;
 This event fires when an item gets added or removed to the player's inventory.
 Type:   PlayerInventoryItemChangeAfterEventSignal
 Notes:
 This property can be read in early-execution mode.
  playerJoin
  read-only playerJoin: PlayerJoinAfterEventSignal;
 This event fires when a player joins a world.  See also playerSpawn for another related event you can trap for when a player is spawned the first time within a world.
 Type:   PlayerJoinAfterEventSignal
 Notes:
 This property can be read in early-execution mode.
  playerLeave
  read-only playerLeave: PlayerLeaveAfterEventSignal;
 This event fires when a player leaves a world.
 Type:   PlayerLeaveAfterEventSignal
 Notes:
 This property can be read in early-execution mode.
  playerPlaceBlock
  read-only playerPlaceBlock: PlayerPlaceBlockAfterEventSignal;
 This event fires for a block that is placed by a player.
 Type:   PlayerPlaceBlockAfterEventSignal
 Notes:
 This property can be read in early-execution mode.
  playerSpawn
  read-only playerSpawn: PlayerSpawnAfterEventSignal;
 This event fires when a player spawns or respawns. Note that an additional flag within this event will tell you whether the player is spawning right after join vs. a respawn.
 Type:   PlayerSpawnAfterEventSignal
 Notes:
 This property can be read in early-execution mode.
  playerStartBreakingBlock
  read-only playerStartBreakingBlock: PlayerStartBreakingBlockAfterEventSignal;
 This event fires when a player starts breaking a block.
 Type:   PlayerStartBreakingBlockAfterEventSignal
 Notes:
 This property can be read in early-execution mode.
  playerSwingStart
  read-only playerSwingStart: PlayerSwingStartAfterEventSignal;
 Type:   PlayerSwingStartAfterEventSignal
 Notes:
 This property can be read in early-execution mode.
  playerUseNameTag
  read-only playerUseNameTag: PlayerUseNameTagAfterEventSignal;
 An event for when a player uses a named name tag on an entity.
 Type:   PlayerUseNameTagAfterEventSignal
 Caution
 This property is still in pre-release.  Its signature may change or it may be removed in future releases.
 Notes:
 This property can be read in early-execution mode.
  pressurePlatePop
  read-only pressurePlatePop: PressurePlatePopAfterEventSignal;
 A pressure plate has popped back up (i.e., there are no entities on the pressure plate.)
 Type:   PressurePlatePopAfterEventSignal
 Notes:
 This property can be read in early-execution mode.
  pressurePlatePush
  read-only pressurePlatePush: PressurePlatePushAfterEventSignal;
 A pressure plate has pushed (at least one entity has moved onto a pressure plate.)
 Type:   PressurePlatePushAfterEventSignal
 Notes:
 This property can be read in early-execution mode.
  projectileHitBlock
  read-only projectileHitBlock: ProjectileHitBlockAfterEventSignal;
 This event fires when a projectile hits a block.
 Type:   ProjectileHitBlockAfterEventSignal
 Notes:
 This property can be read in early-execution mode.
  projectileHitEntity
  read-only projectileHitEntity: ProjectileHitEntityAfterEventSignal;
 This event fires when a projectile hits an entity.
 Type:   ProjectileHitEntityAfterEventSignal
 Notes:
 This property can be read in early-execution mode.
  soundCompleted
  read-only soundCompleted: SoundCompletedAfterEventSignal;
 A tracked sound's declared duration elapsed.
 Type:   SoundCompletedAfterEventSignal
 Caution
 This property is still in pre-release.  Its signature may change or it may be removed in future releases.
 Notes:
 This property can be read in early-execution mode.
  targetBlockHit
  read-only targetBlockHit: TargetBlockHitAfterEventSignal;
 A target block was hit.
 Type:   TargetBlockHitAfterEventSignal
 Notes:
 This property can be read in early-execution mode.
  tripWireTrip
  read-only tripWireTrip: TripWireTripAfterEventSignal;
 A trip wire was tripped.
 Type:   TripWireTripAfterEventSignal
 Notes:
 This property can be read in early-execution mode.
  weatherChange
  read-only weatherChange: WeatherChangeAfterEventSignal;
 This event will be triggered when the weather changes within Minecraft.
 Type:   WeatherChangeAfterEventSignal
 Notes:
 This property can be read in early-execution mode.
  worldLoad
  read-only worldLoad: WorldLoadAfterEventSignal;
 Type:   WorldLoadAfterEventSignal
 Notes:
 This property can be read in early-execution mode.
			 Feedback
					Was this page helpful?
						 Yes
						 No
							 No
								Need help with this topic?
								Want to try using Ask Learn to clarify or guide you through this topic?
			 Ask Learn
			 Ask Learn
				  Suggest a fix?
				Additional resources
				 Last updated on
		2026-08-05
			 In this article
					Was this page helpful?
								Need help with this topic?
								Want to try using Ask Learn to clarify or guide you through this topic?
			 Ask Learn
			 Ask Learn
				  Suggest a fix?
		      en-us
			 Your Privacy Choices
				 Theme
							  Light
							  Dark
							  High contrast
		 AI Disclaimer
		 Previous Versions
		 Blog
		 Contribute
		 Privacy
		 Consumer Health Privacy
		 Terms of Use
		 Trademarks
				 &copy; Microsoft 2026
