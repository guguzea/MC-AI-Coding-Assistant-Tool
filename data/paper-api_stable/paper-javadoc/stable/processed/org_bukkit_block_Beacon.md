---
title: "org.bukkit.block.Beacon"
package: "org.bukkit.block"
source: https://jd.papermc.io/paper/26.3/org/bukkit/block/Beacon.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface Beacon**
`public interface Beacon extends LockableTileState`
- `@NotNull @NotNull Collection<LivingEntity> getEntitiesInRange()`
- `int getTier()`
- `@Nullable @Nullable PotionEffect getPrimaryEffect()`
- `void setPrimaryEffect(@Nullable @Nullable PotionEffectType effect)`
- `@Nullable @Nullable PotionEffect getSecondaryEffect()`
- `void setSecondaryEffect(@Nullable @Nullable PotionEffectType effect)`
- `double getEffectRange()`
- `void setEffectRange(double range)`
- `void resetEffectRange()`
