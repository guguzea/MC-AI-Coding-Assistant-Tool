---
title: "io.papermc.paper.datacomponent.item.Equippable"
package: "io.papermc.paper.datacomponent.item"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/datacomponent/item/Equippable.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface Equippable**
`@NonExtendable public interface Equippable extends BuildableDataComponent<Equippable, Equippable.Builder>`
- `@Contract(value="_ -> new", pure=true) static Equippable.Builder equippable(EquipmentSlot slot)`
- `@Contract(pure=true) EquipmentSlot slot()`
- `@Contract(pure=true) Key equipSound()`
- `@Contract(pure=true) @Nullable Key assetId()`
- `@Contract(pure=true) @Nullable Key cameraOverlay()`
- `@Contract(pure=true) @Nullable RegistryKeySet<EntityType> allowedEntities()`
- `@Contract(pure=true) boolean dispensable()`
- `@Contract(pure=true) boolean swappable()`
- `@Contract(pure=true) boolean damageOnHurt()`
- `@Contract(pure=true) boolean equipOnInteract()`
- `@Contract(pure=true) boolean canBeSheared()`
- `@Contract(pure=true) Key shearSound()`
