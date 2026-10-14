---
title: "org.bukkit.packs.DataPackManager"
package: "org.bukkit.packs"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/packs/DataPackManager.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface DataPackManager**
`public interface DataPackManager`
- `@NotNull Collection<DataPack> getDataPacks()`
- `@Nullable DataPack getDataPack(@NotNull NamespacedKey dataPackKey)`
- `@NotNull Collection<DataPack> getEnabledDataPacks(@NotNull World world)`
- `@NotNull Collection<DataPack> getDisabledDataPacks(@NotNull World world)`
- `boolean isEnabledByFeature(@NotNull Material material, @NotNull World world)`
- `@Internal boolean isEnabledByFeature(@NotNull ItemType itemType, @NotNull World world)`
- `@Internal boolean isEnabledByFeature(@NotNull BlockType blockType, @NotNull World world)`
- `boolean isEnabledByFeature(@NotNull EntityType entityType, @NotNull World world)`
