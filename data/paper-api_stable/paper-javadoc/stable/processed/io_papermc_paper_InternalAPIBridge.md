---
title: "io.papermc.paper.InternalAPIBridge"
package: "io.papermc.paper"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/InternalAPIBridge.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface InternalAPIBridge**
`@Internal public interface InternalAPIBridge`
- `static InternalAPIBridge get()`
- `@Deprecated(forRemoval=true, since="1.21.5") @ScheduledForRemoval(inVersion="1.22") Biome constructLegacyCustomBiome()`
- `CombatEntry createCombatEntry(LivingEntity entity, DamageSource damageSource, float damage)`
- `CombatEntry createCombatEntry(DamageSource damageSource, float damage, @Nullable FallLocationType fallLocationType, float fallDistance)`
- `Predicate<CommandSourceStack> restricted(Predicate<CommandSourceStack> predicate, boolean restricted)`
- `ResolvableProfile defaultMannequinProfile()`
- `@Contract(value="-> new", pure=true) SkinParts.Mutable allSkinParts()`
- `Component defaultMannequinDescription()`
- `<MODERN,LEGACY> GameRule<LEGACY> legacyGameRuleBridge(GameRule<MODERN> rule, Function<LEGACY,MODERN> fromLegacyToModern, Function<MODERN,LEGACY> toLegacyFromModern, Class<LEGACY> legacyClass)`
- `Set<Pose> validMannequinPoses()`
- `PoiType.Occupancy createOccupancy(String enumNameEntry)`
- `DamageSource.Builder createDamageSourceBuilder(DamageType damageType)`
- `DamageEffect getDamageEffect(String key)`
- `String getTranslationKey(EntityType entityType)`
- `SpawnCategory getSpawnCategory(EntityType entityType)`
- `default VersionFetcher getVersionFetcher()`
- `ItemStack deserializeItem(byte[] data)`
- `boolean hasDefaultEntityAttributes(NamespacedKey entityKey)`
- `Attributable getDefaultEntityAttributes(NamespacedKey entityKey)`
- `String getStatisticCriteriaKey(Statistic statistic)`
- `LifecycleEventManager<Plugin> createPluginLifecycleEventManager(JavaPlugin plugin, BooleanSupplier registrationCheck)`
- `ItemStack createEmptyStack()`
- `Component resolveWithContext(Component component, @Nullable CommandSender context, @Nullable Entity scoreboardSubject, boolean bypassPermissions) throws IOException`
- `ComponentFlattener componentFlattener()`
- `<C> PersistentDataKey<C> createPersistentDataKey(Key key, PersistentDataType<?,C> type)`
