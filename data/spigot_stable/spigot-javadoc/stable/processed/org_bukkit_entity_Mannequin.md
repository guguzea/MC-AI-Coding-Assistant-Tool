---
title: "org.bukkit.entity.Mannequin"
package: "org.bukkit.entity"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/entity/Mannequin.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface Mannequin**
`public interface Mannequin extends LivingEntity`
- `@NotNull MainHand getMainHand()`
- `void setMainHand(@NotNull MainHand hand)`
- `boolean isModelPartShown(@NotNull PlayerModelPart part)`
- `void setModelPartShown(@NotNull PlayerModelPart part, boolean shown)`
- `@Nullable PlayerProfile getPlayerProfile()`
- `void setPlayerProfile(@Nullable PlayerProfile profile)`
- `void setPose(@NotNull Pose pose)`
- `boolean isImmovable()`
- `void setImmovable(boolean immovable)`
- `@Nullable @Deprecated(since="1.21.11") String getDescripion()`
- `@Nullable String getDescription()`
- `void setDescription(@Nullable String description)`
- `boolean isHideDescription()`
- `void setHideDescription(boolean hide)`
