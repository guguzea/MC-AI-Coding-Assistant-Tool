---
title: "org.bukkit.inventory.meta.components.JukeboxPlayableComponent"
package: "org.bukkit.inventory.meta.components"
source: https://jd.papermc.io/paper/26.3/org/bukkit/inventory/meta/components/JukeboxPlayableComponent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface JukeboxPlayableComponent**
`@Experimental public interface JukeboxPlayableComponent extends ConfigurationSerializable`
- `@Nullable @Nullable JukeboxSong getSong()`
- `@NotNull @NotNull NamespacedKey getSongKey()`
- `void setSong(@NotNull @NotNull JukeboxSong song)`
- `void setSongKey(@NotNull @NotNull NamespacedKey song)`
- `@Deprecated(since="1.21.5", forRemoval=true) @Contract("-> true") default boolean isShowInTooltip()`
- `@Deprecated(since="1.21.5", forRemoval=true) default void setShowInTooltip(boolean show)`
