---
title: "org.bukkit.damage.DamageSource.Builder"
package: "org.bukkit.damage"
source: https://jd.papermc.io/paper/26.3/org/bukkit/damage/DamageSource.Builder.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface DamageSource.Builder**
`public static interface DamageSource.Builder`
- `@NotNull @NotNull DamageSource.Builder withCausingEntity(@NotNull @NotNull Entity entity)`
- `@NotNull @NotNull DamageSource.Builder withDirectEntity(@NotNull @NotNull Entity entity)`
- `@NotNull @NotNull DamageSource.Builder withDamageLocation(@NotNull @NotNull Location location)`
- `@Experimental @NotNull @NotNull DamageSource.Builder withDamageContext(@NotNull @NotNull Consumer<Pointers.Builder> consumer)`
- `@NotNull @NotNull DamageSource build()`
