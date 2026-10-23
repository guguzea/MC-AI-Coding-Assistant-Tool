---
title: "org.bukkit.packs.DataPackManager"
package: "org.bukkit.packs"
source: https://jd.papermc.io/paper/1.21.1/org/bukkit/packs/DataPackManager.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `@NotNull @NotNull Collection<DataPack> getDataPacks()`
- `@Nullable @Nullable DataPack getDataPack(@NotNull @NotNull NamespacedKey dataPackKey)`
- `@NotNull @NotNull Collection<DataPack> getEnabledDataPacks(@NotNull @NotNull World world)`
- `@NotNull @NotNull Collection<DataPack> getDisabledDataPacks(@NotNull @NotNull World world)`
- `boolean isEnabledByFeature(@NotNull @NotNull Material material, @NotNull @NotNull World world)`
- `@Internal boolean isEnabledByFeature(@NotNull @NotNull ItemType itemType, @NotNull @NotNull World world)`
- `@Internal boolean isEnabledByFeature(@NotNull @NotNull BlockType blockType, @NotNull @NotNull World world)`
- `boolean isEnabledByFeature(@NotNull @NotNull EntityType entityType, @NotNull @NotNull World world)`
