---
title: "org.bukkit.inventory.view.BeaconView"
package: "org.bukkit.inventory.view"
source: https://jd.papermc.io/paper/26.3/org/bukkit/inventory/view/BeaconView.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface BeaconView**
`public interface BeaconView extends InventoryView`
- `@NotNull @NotNull BeaconInventory getTopInventory()`
- `int getTier()`
- `@Nullable @Nullable PotionEffectType getPrimaryEffect()`
- `@Nullable @Nullable PotionEffectType getSecondaryEffect()`
- `void setPrimaryEffect(@Nullable @Nullable PotionEffectType effect)`
- `void setSecondaryEffect(@Nullable @Nullable PotionEffectType effect)`
