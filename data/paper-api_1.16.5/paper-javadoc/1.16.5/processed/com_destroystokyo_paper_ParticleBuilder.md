---
title: "com.destroystokyo.paper.ParticleBuilder"
package: "com.destroystokyo.paper"
source: https://jd.papermc.io/paper/1.16.5/com/destroystokyo/paper/ParticleBuilder.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `public ParticleBuilder&#8203;(@NotNull @NotNull Particle particle)`
- `@NotNull public @NotNull ParticleBuilder spawn()`
- `@NotNull public @NotNull Particle particle()`
- `@NotNull public @NotNull ParticleBuilder particle&#8203;(@NotNull @NotNull Particle particle)`
- `@Nullable public @Nullable List<Player> receivers()`
- `public boolean hasReceivers()`
- `@NotNull public @NotNull ParticleBuilder allPlayers()`
- `@NotNull public @NotNull ParticleBuilder receivers&#8203;(@Nullable @Nullable List<Player> receivers)`
- `@NotNull public @NotNull ParticleBuilder receivers&#8203;(@Nullable @Nullable Collection<Player> receivers)`
- `@NotNull public @NotNull ParticleBuilder receivers&#8203;(@Nullable @Nullable Player... receivers)`
- `@NotNull public @NotNull ParticleBuilder receivers&#8203;(int radius)`
- `@NotNull public @NotNull ParticleBuilder receivers&#8203;(int radius, boolean byDistance)`
- `@NotNull public @NotNull ParticleBuilder receivers&#8203;(int xzRadius, int yRadius)`
- `@NotNull public @NotNull ParticleBuilder receivers&#8203;(int xzRadius, int yRadius, boolean byDistance)`
- `@NotNull public @NotNull ParticleBuilder receivers&#8203;(int xRadius, int yRadius, int zRadius)`
- `@Nullable public @Nullable Player source()`
- `@NotNull public @NotNull ParticleBuilder source&#8203;(@Nullable @Nullable Player source)`
- `@Nullable public @Nullable Location location()`
- `@NotNull public @NotNull ParticleBuilder location&#8203;(@NotNull @NotNull Location location)`
- `@NotNull public @NotNull ParticleBuilder location&#8203;(@NotNull @NotNull World world, double x, double y, double z)`
- `public int count()`
- `@NotNull public @NotNull ParticleBuilder count&#8203;(int count)`
- `public double offsetX()`
- `public double offsetY()`
- `public double offsetZ()`
- `@NotNull public @NotNull ParticleBuilder offset&#8203;(double offsetX, double offsetY, double offsetZ)`
- `public double extra()`
- `@NotNull public @NotNull ParticleBuilder extra&#8203;(double extra)`
- `@Nullable public <T> T data()`
- `@NotNull public <T> @NotNull ParticleBuilder data&#8203;(@Nullable T data)`
- `@NotNull public @NotNull ParticleBuilder force&#8203;(boolean force)`
- `@NotNull public @NotNull ParticleBuilder color&#8203;(@Nullable @Nullable Color color)`
- `@NotNull public @NotNull ParticleBuilder color&#8203;(@Nullable @Nullable Color color, float size)`
- `@NotNull public @NotNull ParticleBuilder color&#8203;(int r, int g, int b)`
