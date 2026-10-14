---
title: "org.bukkit.inventory.view.BeaconView"
package: "org.bukkit.inventory.view"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/inventory/view/BeaconView.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T07:16:14.361Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface BeaconView**
`public interface BeaconView extends InventoryView`
- `@NotNull BeaconInventory getTopInventory()`
- `int getTier()`
- `@Nullable PotionEffectType getPrimaryEffect()`
- `@Nullable PotionEffectType getSecondaryEffect()`
- `void setPrimaryEffect(@Nullable PotionEffectType effect)`
- `void setSecondaryEffect(@Nullable PotionEffectType effect)`
