---
title: "org.bukkit.entity.Mannequin"
package: "org.bukkit.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/entity/Mannequin.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface Mannequin**
`@NullMarked public interface Mannequin extends LivingEntity`
- `static Set<Pose> validPoses()`
- `static ResolvableProfile defaultProfile()`
- `static Component defaultDescription()`
- `ResolvableProfile getProfile()`
- `void setProfile(ResolvableProfile profile)`
- `SkinParts.Mutable getSkinParts()`
- `void setSkinParts(SkinParts parts)`
- `boolean isImmovable()`
- `void setImmovable(boolean immovable)`
- `@Nullable Component getDescription()`
- `void setDescription(@Nullable Component description)`
- `MainHand getMainHand()`
- `void setMainHand(MainHand hand)`
- `EntityEquipment getEquipment()`
