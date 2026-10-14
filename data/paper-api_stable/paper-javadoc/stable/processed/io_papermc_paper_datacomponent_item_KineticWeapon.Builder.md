---
title: "io.papermc.paper.datacomponent.item.KineticWeapon.Builder"
package: "io.papermc.paper.datacomponent.item"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/datacomponent/item/KineticWeapon.Builder.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface KineticWeapon.Builder**
`@NonExtendable public static interface KineticWeapon.Builder extends DataComponentBuilder<KineticWeapon>`
- `@Contract(value="_ -> this", mutates="this") KineticWeapon.Builder contactCooldownTicks(@NonNegative int ticks)`
- `@Contract(value="_ -> this", mutates="this") KineticWeapon.Builder delayTicks(@NonNegative int ticks)`
- `@Contract(value="_ -> this", mutates="this") KineticWeapon.Builder dismountConditions(@Nullable KineticWeapon.Condition condition)`
- `@Contract(value="_ -> this", mutates="this") KineticWeapon.Builder knockbackConditions(@Nullable KineticWeapon.Condition condition)`
- `@Contract(value="_ -> this", mutates="this") KineticWeapon.Builder damageConditions(@Nullable KineticWeapon.Condition condition)`
- `@Contract(value="_ -> this", mutates="this") KineticWeapon.Builder forwardMovement(float forwardMovement)`
- `@Contract(value="_ -> this", mutates="this") KineticWeapon.Builder damageMultiplier(float damageMultiplier)`
- `@Contract(value="_ -> this", mutates="this") KineticWeapon.Builder sound(@Nullable Key sound)`
- `@Contract(value="_ -> this", mutates="this") KineticWeapon.Builder hitSound(@Nullable Key sound)`
