> 来源：https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/minecraft-server?view=minecraft-bedrock-stable
> 抓取时间：2026-09-24T02:07:26.624Z
> 警告：此文档可能滞后于当前正式版

# @minecraft/server Module

Contains many types related to manipulating a Minecraft world, including entities, blocks, dimensions, and more.

## Changelog

## Manifest Details

```json
{
 "module_name": "@minecraft/server",
 "version": "2.10.0"
}
```

This is version 2.x.x of this module, which is the latest as of version 1.26.60-beta.28 of Minecraft.

## Available Versions

- 2.12.0-beta.1.26.60-preview.28

- 2.10.0

- 2.9.0

- 2.8.0

- 2.7.0

- 2.6.0

- 2.5.0

- 2.4.0

- 2.3.0

- 2.2.0

- 2.1.0

- 2.0.0

### Prior Versions

The following API versions are from a major version that is documented here: @minecraft/server :

- 1.19.0

- 1.18.0

- 1.17.0

- 1.16.0

- 1.15.0

- 1.14.0

- 1.13.0

- 1.12.0

- 1.11.0

- 1.10.0

- 1.9.0

- 1.8.0

- 1.7.0

- 1.6.0

- 1.5.0

- 1.4.0

- 1.3.0

- 1.2.0

- 1.1.0

- 1.0.0

## Enumerations

- AimAssistTargetMode

- BlockComponentTypes

- BlockPistonState

- BlockVolumeIntersection

- BookErrorReason

- ButtonState

- CameraShakeType

- CloneMode

- CommandPermissionLevel

- ContainerRulesErrorReason

- ControlScheme

- CustomCommandErrorReason

- CustomCommandParamType

- CustomCommandSource

- CustomCommandStatus

- CustomComponentNameErrorReason

- Difficulty

- Direction

- DisplaySlotId

- DyeColor

- EasingType

- EnchantmentSlot

- EntityAttachPoint

- EntityComponentTypes

- EntityDamageCause

- EntityHealCause

- EntityInitializationCause

- EntitySwingSource

- EquipmentSlot

- FluidType

- GameMode

- GameRule

- GraphicsMode

- HeldItemOption

- HudElement

- HudVisibility

- InputButton

- InputMode

- InputPermissionCategory

- ItemComponentTypes

- ItemLockMode

- LiquidSettings

- LiquidType

- LocatorBarErrorReason

- MemoryTier

- MoonPhase

- MovementType

- NamespaceNameErrorReason

- ObjectiveSortOrder

- PaletteColor

- PlatformType

- PlayerInventoryType

- PlayerPermissionLevel

- PlayerSplitScreenSlot

- PlayerWaypointsMode

- PoiBlockOccupancyFilter

- ScoreboardIdentityType

- ScriptEventSource

- SignSide

- StickyType

- StructureAnimationMode

- StructureMirrorAxis

- StructureRotation

- StructureSaveMode

- TickingAreaErrorReason

- TimeOfDay

- TintMethod

- WatchdogTerminateReason

- WaypointTexture

- WeatherType

# Type Aliases

- BlockComponentReturnType

- BlockComponentTypeMap

- BlockStateArg

- EntityComponentReturnType

- EntityComponentTypeMap

- EntityIdentifierType

- ItemComponentReturnType

- ItemComponentTypeMap

- VanillaEntityIdentifier

## Classes

- AimAssistCategory

- AimAssistCategorySettings

- AimAssistPreset

- AimAssistPresetSettings

- AimAssistRegistry

- BannerPattern

- BiomeType

- BiomeTypes

- Block

- BlockBoundingBoxUtils

- BlockComponent

- BlockComponentBlockBreakEvent

- BlockComponentBlockStateChangeEvent

- BlockComponentEntityEvent

- BlockComponentEntityFallOnEvent

- BlockComponentNamedTickEvent

- BlockComponentOnPlaceEvent

- BlockComponentPlayerBreakEvent

- BlockComponentPlayerInteractEvent

- BlockComponentPlayerPlaceBeforeEvent

- BlockComponentRandomTickEvent

- BlockComponentRedstoneUpdateEvent

- BlockComponentRegistry

- BlockComponentStepOffEvent

- BlockComponentStepOnEvent

- BlockComponentTickEvent

- BlockContainerClosedAfterEvent

- BlockContainerClosedAfterEventSignal

- BlockContainerOpenedAfterEvent

- BlockContainerOpenedAfterEventSignal

- BlockCustomComponentInstance

- BlockDynamicPropertiesComponent

- BlockEntityStorageComponent

- BlockEntityStorageInfo

- BlockEvent

- BlockExplodeAfterEvent

- BlockExplodeAfterEventSignal

- BlockFluidContainerComponent

- BlockInstrumentComponent

- BlockInventoryComponent

- BlockLocationIterator

- BlockMapColorComponent

- BlockMovableComponent

- BlockPermutation

- BlockPistonComponent

- BlockPrecipitationInteractionsComponent

- BlockRecipeCraftingComponent

- BlockRecordPlayerComponent

- BlockRedstoneProducerComponent

- BlockSignComponent

- BlockStates

- BlockStateType

- BlockType

- BlockTypes

- BlockVolume

- BlockVolumeBase

- ButtonPushAfterEvent

- ButtonPushAfterEventSignal

- Camera

- CarryOverBlockEntityDataFunction

- CatmullRomSpline

- ChatSendAfterEvent

- ChatSendAfterEventSignal

- ChatSendBeforeEvent

- ChatSendBeforeEventSignal

- ClientSystemInfo

- CommandResult

- Component

- Container

- ContainerSlot

- CustomCommandOrigin

- CustomCommandRegistry

- CustomComponentParameters

- DamagedByEntityCondition

- DataDrivenEntityTriggerAfterEvent

- DataDrivenEntityTriggerAfterEventSignal

- Dimension

- DimensionRegistry

- DimensionType

- DimensionTypes

- Effect

- EffectAddAfterEvent

- EffectAddAfterEventSignal

- EffectAddBeforeEvent

- EffectAddBeforeEventSignal

- EffectType

- EffectTypes

- EmptyLootItem

- EnchantInfo

- EnchantmentType

- EnchantmentTypes

- EnchantRandomEquipmentFunction

- EnchantRandomlyFunction

- EnchantWithLevelsFunction

- Entity

- EntityAddRiderComponent

- EntityAgeableComponent

- EntityAttributeComponent

- EntityBaseMovementComponent

- EntityBreathableComponent

- EntityCanClimbComponent

- EntityCanFlyComponent

- EntityCanPowerJumpComponent

- EntityColor2Component

- EntityColorComponent

- EntityComponent

- EntityContainerClosedAfterEvent

- EntityContainerClosedAfterEventSignal

- EntityContainerOpenedAfterEvent

- EntityContainerOpenedAfterEventSignal

- EntityDefinitionFeedItem

- EntityDieAfterEvent

- EntityDieAfterEventSignal

- EntityEnderInventoryComponent

- EntityEquippableComponent

- EntityExhaustionComponent

- EntityFireImmuneComponent

- EntityFloatsInLiquidComponent

- EntityFlyingSpeedComponent

- EntityFrictionModifierComponent

- EntityHasMarkVariantCondition

- EntityHasVariantCondition

- EntityHealableComponent

- EntityHealAfterEvent

- EntityHealAfterEventSignal

- EntityHealBeforeEvent

- EntityHealBeforeEventSignal

- EntityHealSource

- EntityHealthChangedAfterEvent

- EntityHealthChangedAfterEventSignal

- EntityHealthComponent

- EntityHitBlockAfterEvent

- EntityHitBlockAfterEventSignal

- EntityHitEntityAfterEvent

- EntityHitEntityAfterEventSignal

- EntityHungerComponent

- EntityHurtAfterEvent

- EntityHurtAfterEventSignal

- EntityHurtBeforeEvent

- EntityHurtBeforeEventSignal

- EntityInventoryComponent

- EntityIsBabyComponent

- EntityIsChargedComponent

- EntityIsChestedComponent

- EntityIsDyeableComponent

- EntityIsHiddenWhenInvisibleComponent

- EntityIsIgnitedComponent

- EntityIsIllagerCaptainComponent

- EntityIsSaddledComponent

- EntityIsShakingComponent

- EntityIsShearedComponent

- EntityIsStackableComponent

- EntityIsStunnedComponent

- EntityIsTamedComponent

- EntityItemComponent

- EntityItemDropAfterEvent

- EntityItemDropAfterEventSignal

- EntityItemPickupAfterEvent

- EntityItemPickupAfterEventSignal

- EntityItemPickupBeforeEvent

- EntityItemPickupBeforeEventSignal

- EntityKilledCondition

- EntityLavaMovementComponent

- EntityLeashableComponent

- EntityLoadAfterEvent

- EntityLoadAfterEventSignal

- EntityMarkVariantComponent

- EntityMovementAmphibiousComponent

- EntityMovementBasicComponent

- EntityMovementComponent

- EntityMovementFlyComponent

- EntityMovementGenericComponent

- EntityMovementGlideComponent

- EntityMovementHoverComponent

- EntityMovementJumpComponent

- EntityMovementSkipComponent

- EntityMovementSwayComponent

- EntityNavigationClimbComponent

- EntityNavigationComponent

- EntityNavigationFloatComponent

- EntityNavigationFlyComponent

- EntityNavigationGenericComponent

- EntityNavigationHoverComponent

- EntityNavigationWalkComponent

- EntityNpcComponent

- EntityOnFireComponent

- EntityProjectileComponent

- EntityPushThroughComponent

- EntityRemoveAfterEvent

- EntityRemoveAfterEventSignal

- EntityRemoveBeforeEvent

- EntityRemoveBeforeEventSignal

- EntityRideableComponent

- EntityRidingComponent

- EntitySaturationComponent

- EntityScaleComponent

- EntitySkinIdComponent

- EntitySpawnAfterEvent

- EntitySpawnAfterEventSignal

- EntityStartSneakingAfterEvent

- EntityStartSneakingAfterEventSignal

- EntityStopSneakingAfterEvent

- EntityStopSneakingAfterEventSignal

- EntityStrengthComponent

- EntityTameableComponent

- EntityTamedAfterEvent

- EntityTamedAfterEventSignal

- EntityTamedBeforeEvent

- EntityTamedBeforeEventSignal

- EntityTameMountComponent

- EntityType

- EntityTypeFamilyComponent

- EntityTypes

- EntityUnderwaterMovementComponent

- EntityUpgradeAfterEvent

- EntityUpgradeAfterEventSignal

- EntityVariantComponent

- EntityWantsJockeyComponent

- EntityWaypoint

- ExplorationMapFunction

- ExplosionAfterEvent

- ExplosionAfterEventSignal

- ExplosionBeforeEvent

- ExplosionBeforeEventSignal

- ExplosionDecayFunction

- FeedItem

- FeedItemEffect

- FillContainerFunction

- FluidContainer

- FogSettings

- GameRuleChangeAfterEvent

- GameRuleChangeAfterEventSignal

- GameRules

- InputInfo

- IsBabyCondition

- ISerializable

- ItemBlockDynamicPropertiesComponent

- ItemBookComponent

- ItemCompleteUseAfterEvent

- ItemCompleteUseAfterEventSignal

- ItemCompleteUseEvent

- ItemComponent

- ItemComponentBeforeDurabilityDamageEvent

- ItemComponentCompleteUseEvent

- ItemComponentConsumeEvent

- ItemComponentHitEntityEvent

- ItemComponentMineBlockEvent

- ItemComponentRegistry

- ItemComponentUseEvent

- ItemComponentUseOnEvent

- ItemCompostableComponent

- ItemCooldownComponent

- ItemCustomComponentInstance

- ItemDurabilityComponent

- ItemDyeableComponent

- ItemEnchantableComponent

- ItemFoodComponent

- ItemInventoryComponent

- ItemPotionComponent

- ItemReleaseUseAfterEvent

- ItemReleaseUseAfterEventSignal

- ItemStack

- ItemStartUseAfterEvent

- ItemStartUseAfterEventSignal

- ItemStartUseOnAfterEvent

- ItemStartUseOnAfterEventSignal

- ItemStopUseAfterEvent

- ItemStopUseAfterEventSignal

- ItemStopUseOnAfterEvent

- ItemStopUseOnAfterEventSignal

- ItemType

- ItemTypes

- ItemUseAfterEvent

- ItemUseAfterEventSignal

- ItemUseBeforeEvent

- ItemUseBeforeEventSignal

- ItemUseOnEvent

- KilledByEntityCondition

- KilledByPlayerCondition

- KilledByPlayerOrPetsCondition

- LeverActionAfterEvent

- LeverActionAfterEventSignal

- LinearSpline

- ListBlockVolume

- LocationWaypoint

- LocatorBar

- LootingEnchantFunction

- LootItem

- LootItemCondition

- LootItemFunction

- LootPool

- LootPoolEntry

- LootPoolTiers

- LootTable

- LootTableEntry

- LootTableManager

- LootTableReference

- MatchToolCondition

- MessageReceiveAfterEvent

- MolangVariableMap

- PackSettingChangeAfterEvent

- PackSettingChangeAfterEventSignal

- PassengerOfEntityCondition

- PistonActivateAfterEvent

- PistonActivateAfterEventSignal

- Player

- PlayerAimAssist

- PlayerBreakBlockAfterEvent

- PlayerBreakBlockAfterEventSignal

- PlayerBreakBlockBeforeEvent

- PlayerBreakBlockBeforeEventSignal

- PlayerButtonInputAfterEvent

- PlayerButtonInputAfterEventSignal

- PlayerCancelBreakingBlockAfterEvent

- PlayerCancelBreakingBlockAfterEventSignal

- PlayerCraftRecipeAfterEvent

- PlayerCraftRecipeAfterEventSignal

- PlayerCursorInventoryComponent

- PlayerDimensionChangeAfterEvent

- PlayerDimensionChangeAfterEventSignal

- PlayerEmoteAfterEvent

- PlayerEmoteAfterEventSignal

- PlayerGameModeChangeAfterEvent

- PlayerGameModeChangeAfterEventSignal

- PlayerGameModeChangeBeforeEvent

- PlayerGameModeChangeBeforeEventSignal

- PlayerHotbarSelectedSlotChangeAfterEvent

- PlayerHotbarSelectedSlotChangeAfterEventSignal

- PlayerInputModeChangeAfterEvent

- PlayerInputModeChangeAfterEventSignal

- PlayerInputPermissionCategoryChangeAfterEvent

- PlayerInputPermissionCategoryChangeAfterEventSignal

- PlayerInputPermissions

- PlayerInteractWithBlockAfterEvent

- PlayerInteractWithBlockAfterEventSignal

- PlayerInteractWithBlockBeforeEvent

- PlayerInteractWithBlockBeforeEventSignal

- PlayerInteractWithEntityAfterEvent

- PlayerInteractWithEntityAfterEventSignal

- PlayerInteractWithEntityBeforeEvent

- PlayerInteractWithEntityBeforeEventSignal

- PlayerInventoryItemChangeAfterEvent

- PlayerInventoryItemChangeAfterEventSignal

- PlayerJoinAfterEvent

- PlayerJoinAfterEventSignal

- PlayerLeaveAfterEvent

- PlayerLeaveAfterEventSignal

- PlayerLeaveBeforeEvent

- PlayerLeaveBeforeEventSignal

- PlayerPlaceBlockAfterEvent

- PlayerPlaceBlockAfterEventSignal

- PlayerPlaceBlockBeforeEvent

- PlayerPlaceBlockBeforeEventSignal

- PlayerSpawnAfterEvent

- PlayerSpawnAfterEventSignal

- PlayerStartBreakingBlockAfterEvent

- PlayerStartBreakingBlockAfterEventSignal

- PlayerSwingStartAfterEvent

- PlayerSwingStartAfterEventSignal

- PlayerUseNameTagAfterEvent

- PlayerUseNameTagAfterEventSignal

- PlayerWaypoint

- PoiBlockInstance

- PoiBlockManager

- PoiBlockType

- PoiManager

- PotionDeliveryType

- PotionEffectType

- Potions

- PressurePlatePopAfterEvent

- PressurePlatePopAfterEventSignal

- PressurePlatePushAfterEvent

- PressurePlatePushAfterEventSignal

- PrimitiveShape

- PrimitiveShapesManager

- ProjectileHitBlockAfterEvent

- ProjectileHitBlockAfterEventSignal

- ProjectileHitEntityAfterEvent

- ProjectileHitEntityAfterEventSignal

- RandomAuxValueFunction

- RandomBlockStateFunction

- RandomChanceCondition

- RandomChanceWithLootingCondition

- RandomDifficultyChanceCondition

- RandomDyeFunction

- RandomRegionalDifficultyChanceCondition

- RecipeCraftingContext

- Scoreboard

- ScoreboardIdentity

- ScoreboardObjective

- ScoreboardScoreInfo

- ScreenDisplay

- ScriptEventCommandMessageAfterEvent

- ScriptEventCommandMessageAfterEventSignal

- Seat

- ServerMessageAfterEventSignal

- SetArmorTrimFunction

- SetBannerDetailsFunction

- SetBookContentsFunction

- SetDataFromColorIndexFunction

- SetItemCountFunction

- SetItemDamageFunction

- SetItemDataFunction

- SetItemLoreFunction

- SetItemNameFunction

- SetOminousBottleFunction

- SetPotionFunction

- SetSpawnEggFunction

- SetStewEffectFunction

- ShutdownBeforeEventSignal

- ShutdownEvent

- SmeltItemFunction

- SoundCompletedAfterEvent

- SoundCompletedAfterEventSignal

- SoundDefinition

- SoundDefinitionRegistry

- SoundDurationInfo

- SoundInstance

- SpecificEnchantFunction

- StartupBeforeEventSignal

- StartupEvent

- Structure

- StructureManager

- System

- SystemAfterEvents

- SystemBeforeEvents

- SystemInfo

- TargetBlockHitAfterEvent

- TargetBlockHitAfterEventSignal

- TextPrimitive

- TickingAreaManager

- TimeMarker

- Trigger

- TripWireTripAfterEvent

- TripWireTripAfterEventSignal

- WatchdogTerminateBeforeEvent

- WatchdogTerminateBeforeEventSignal

- Waypoint

- WeatherChangeAfterEvent

- WeatherChangeAfterEventSignal

- WeatherChangeBeforeEvent

- WeatherChangeBeforeEventSignal

- World

- WorldAfterEvents

- WorldBeforeEvents

- WorldClock

- WorldClockOnPausedAfterEvent

- WorldClockOnPausedAfterEventSignal

- WorldClockOnRestartBeforeEvent

- WorldClockOnRestartBeforeEventSignal

- WorldClockOnResumedAfterEvent

- WorldClockOnResumedAfterEventSignal

- WorldClockOnTimeMarkerAfterEvent

- WorldClockOnTimeMarkerAfterEventSignal

- WorldClockOnTimeModifiedAfterEvent

- WorldClockOnTimeModifiedAfterEventSignal

- WorldClockRegistry

- WorldLoadAfterEvent

- WorldLoadAfterEventSignal

## Interfaces

- AABB

- AnimationOptions

- BiomeFilter

- BiomeSearchOptions

- BlockBoundingBox

- BlockContainerAccessEventOptions

- BlockCustomComponent

- BlockEventOptions

- BlockFillOptions

- BlockFilter

- BlockHitInformation

- BlockQueryOptions

- BlockRaycastHit

- BlockRaycastOptions

- CameraAttachOptions

- CameraFadeOptions

- CameraFadeTimeOptions

- CameraFixedBoomOptions

- CameraFovOptions

- CameraSetFacingOptions

- CameraSetLocationOptions

- CameraSetPosOptions

- CameraSetRotOptions

- CameraShakeOptions

- CameraTargetOptions

- ContainerAccessSource

- ContainerAccessSourceFilter

- ContainerRules

- CustomCommand

- CustomCommandParameter

- CustomCommandResult

- CustomTexture

- DefinitionModifier

- DimensionLocation

- EaseOptions

- Enchantment

- EntityApplyDamageByProjectileOptions

- EntityApplyDamageOptions

- EntityContainerAccessEventOptions

- EntityDamageSource

- EntityDataDrivenTriggerEventOptions

- EntityEffectOptions

- EntityEventOptions

- EntityFilter

- EntityHealEventOptions

- EntityHitInformation

- EntityHurtAfterEventOptions

- EntityHurtBeforeEventOptions

- EntityItemDropEventOptions

- EntityItemPickupEventOptions

- EntityQueryOptions

- EntityQueryPropertyOptions

- EntityQueryScoreOptions

- EntityRaycastHit

- EntityRaycastOptions

- EntitySneakingChangedEventOptions

- EntityTamedEventOptions

- EntityVisibilityRules

- EqualsComparison

- ExplosionOptions

- GetBlocksStandingOnOptions

- GreaterThanComparison

- GreaterThanOrEqualsComparison

- HotbarEventOptions

- InputEventOptions

- InventoryItemEventOptions

- ItemCustomComponent

- ItemFilter

- JigsawPlaceOptions

- JigsawStructurePlaceOptions

- LessThanComparison

- LessThanOrEqualsComparison

- MusicOptions

- NotEqualsComparison

- PlayAnimationOptions

- PlayerAimAssistSettings

- PlayerBreakingBlockEventOptions

- PlayerCraftRecipeEventOptions

- PlayerSoundOptions

- PlayerSwingEventOptions

- PlayerVisibilityRules

- PoiDistancePair

- PoiNameFilter

- PoiTagFilter

- PrimitiveShapeQueryOptions

- ProgressKeyFrame

- ProjectileShootOptions

- RangeComparison

- RawMessage

- RawMessageScore

- RawText

- RGB

- RGBA

- RotationKeyFrame

- ScoreboardObjectiveDisplayOptions

- ScriptEventMessageFilterOptions

- SoundDefinitionDurationInfo

- SoundDefinitionFilter

- SoundDefinitionMusicInfo

- SpawnEntityOptions

- SplineAnimation

- StructureCreateOptions

- StructurePlaceOptions

- TeleportOptions

- TickingArea

- TickingAreaOptions

- TimeMarkerOptions

- TitleDisplayOptions

- Vector2

- Vector3

- VectorXZ

- WaypointTextureBounds

- WaypointTextureSelector

- WorldClockEventOptions

- WorldClockRegistrationOptions

- WorldClockTimeMarkerEventOptions

- WorldSoundOptions

## Errors

- BlockCustomComponentAlreadyRegisteredError

- BlockCustomComponentReloadNewComponentError

- BlockCustomComponentReloadNewEventError

- BlockCustomComponentReloadVersionError

- BookError

- BookPageContentError

- CommandError

- ContainerRulesError

- CustomCommandError

- CustomComponentInvalidRegistryError

- CustomComponentNameError

- CustomDimensionAlreadyRegisteredError

- CustomDimensionInvalidRegistryError

- CustomDimensionNameError

- CustomDimensionReloadNewDimensionError

- EnchantmentLevelOutOfBoundsError

- EnchantmentTypeNotCompatibleError

- EnchantmentTypeUnknownIdError

- EntitySpawnError

- FogSettingsError

- InvalidBlockComponentError

- InvalidContainerError

- InvalidContainerSlotError

- InvalidEntityComponentError

- InvalidEntityError

- InvalidItemStackError

- InvalidIteratorError

- InvalidPotionDeliveryTypeError

- InvalidPotionEffectTypeError

- InvalidRecipeError

- InvalidStructureError

- InvalidWaypointError

- InvalidWaypointTextureSelectorError

- ItemCustomComponentAlreadyRegisteredError

- ItemCustomComponentReloadNewComponentError

- ItemCustomComponentReloadNewEventError

- ItemCustomComponentReloadVersionError

- LocationInUnloadedChunkError

- LocationOutOfWorldBoundariesError

- LocatorBarError

- NamespaceNameError

- PlaceJigsawError

- PrimitiveShapeError

- RawMessageError

- TickingAreaError

- UnloadedChunksError

- WorldClockAddTimeMarkerError

- WorldClockInvalidRegistryError

- WorldClockInvalidTimeMarkerError

- WorldClockNotFoundError

- WorldClockRegistrationError

- WorldClockReloadNewWorldClockError

- WorldClockReloadTimeMarkerError

- WorldClockRemoveMinecraftTimeMarkerError

- WorldClockRewindError

- WorldClockTimeMarkerNotFoundError

## Constants

### HudElementsCount

`static read-only HudElementsCount = 13;`

Type: number

### HudVisibilityCount

`static read-only HudVisibilityCount = 2;`

Type: number

### MoonPhaseCount

`static read-only MoonPhaseCount = 8;`

Holds the number of MoonPhases

Type: number

### TicksPerDay

`static read-only TicksPerDay = 24000;`

How many times the server ticks in one in-game day.

Type: number

### TicksPerSecond

`static read-only TicksPerSecond = 20;`

How many times the server ticks per second of real time.

Type: number

## Objects

### system

`static read-only system: System;`

A class that provides system-level events and functions.

Type: System

### world

`static read-only world: World;`

A class that wraps the state of a world - a set of dimensions and the environment of Minecraft.

Type: World

## Peer Dependencies

- @minecraft/common

- @minecraft/vanilla-data

## Feedback

 Want to try using Ask Learn to clarify or guide you through this topic?
