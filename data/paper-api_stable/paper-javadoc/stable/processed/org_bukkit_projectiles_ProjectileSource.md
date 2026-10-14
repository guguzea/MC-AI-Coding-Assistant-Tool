---
title: "org.bukkit.projectiles.ProjectileSource"
package: "org.bukkit.projectiles"
source: https://jd.papermc.io/paper/26.3/org/bukkit/projectiles/ProjectileSource.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface ProjectileSource**
`public interface ProjectileSource`
- `@NotNull default <T extends Projectile> T launchProjectile(@NotNull @NotNull Class<? extends T> projectile)`
- `@NotNull default <T extends Projectile> T launchProjectile(@NotNull @NotNull Class<? extends T> projectile, @Nullable @Nullable Vector velocity)`
- `@NotNull <T extends Projectile> T launchProjectile(@NotNull @NotNull Class<? extends T> projectile, @Nullable @Nullable Vector velocity, @Nullable Consumer<? super T> function)`
