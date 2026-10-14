---
title: "io.papermc.paper.datacomponent.item.KineticWeapon"
package: "io.papermc.paper.datacomponent.item"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/datacomponent/item/KineticWeapon.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface KineticWeapon**
`@NonExtendable public interface KineticWeapon`
- `@Contract(value="-> new", pure=true) static KineticWeapon.Builder kineticWeapon()`
- `@Contract(value="_, _, _ -> new", pure=true) static KineticWeapon.Condition condition(@NonNegative int maxDurationTicks, float minSpeed, float minRelativeSpeed)`
- `@Contract(pure=true) @NonNegative int contactCooldownTicks()`
- `@Contract(pure=true) @NonNegative int delayTicks()`
- `@Contract(pure=true) @Nullable KineticWeapon.Condition dismountConditions()`
- `@Contract(pure=true) @Nullable KineticWeapon.Condition knockbackConditions()`
- `@Contract(pure=true) @Nullable KineticWeapon.Condition damageConditions()`
- `float forwardMovement()`
- `float damageMultiplier()`
- `@Contract(pure=true) @Nullable Key sound()`
- `@Contract(pure=true) @Nullable Key hitSound()`
