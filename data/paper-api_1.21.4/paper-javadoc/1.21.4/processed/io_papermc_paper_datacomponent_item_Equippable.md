---
title: "io.papermc.paper.datacomponent.item.Equippable"
package: "io.papermc.paper.datacomponent.item"
source: https://jd.papermc.io/paper/1.21.4/io/papermc/paper/datacomponent/item/Equippable.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `@Contract(value="_ -> new", pure=true) static Equippable.Builder equippable(EquipmentSlot slot)`
- `@Contract(pure=true) EquipmentSlot slot()`
- `@Contract(pure=true) Key equipSound()`
- `@Contract(pure=true) @Nullable Key assetId()`
- `@Contract(pure=true) @Nullable Key cameraOverlay()`
- `@Contract(pure=true) @Nullable RegistryKeySet<EntityType> allowedEntities()`
- `@Contract(pure=true) boolean dispensable()`
- `@Contract(pure=true) boolean swappable()`
- `@Contract(pure=true) boolean damageOnHurt()`
