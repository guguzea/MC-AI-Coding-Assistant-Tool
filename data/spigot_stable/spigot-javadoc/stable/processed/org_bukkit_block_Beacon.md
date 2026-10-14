---
title: "org.bukkit.block.Beacon"
package: "org.bukkit.block"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/block/Beacon.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T07:16:14.361Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface Beacon**
`public interface Beacon extends TileState, Lockable, Nameable`
- `@NotNull Collection<LivingEntity> getEntitiesInRange()`
- `int getTier()`
- `@Nullable PotionEffect getPrimaryEffect()`
- `void setPrimaryEffect(@Nullable PotionEffectType effect)`
- `@Nullable PotionEffect getSecondaryEffect()`
- `void setSecondaryEffect(@Nullable PotionEffectType effect)`
