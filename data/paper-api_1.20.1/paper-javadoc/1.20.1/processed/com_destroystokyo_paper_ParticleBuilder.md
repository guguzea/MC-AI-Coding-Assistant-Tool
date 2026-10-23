---
title: "com.destroystokyo.paper.ParticleBuilder"
package: "com.destroystokyo.paper"
source: https://jd.papermc.io/paper/1.20.1/com/destroystokyo/paper/ParticleBuilder.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `public ParticleBuilder(@NotNull @NotNull Particle particle)`
- `@NotNull public @NotNull ParticleBuilder spawn()`
- `@NotNull public @NotNull Particle particle()`
- `@NotNull public @NotNull ParticleBuilder particle(@NotNull @NotNull Particle particle)`
- `@Nullable public @Nullable List<Player> receivers()`
- `public boolean hasReceivers()`
- `@NotNull public @NotNull ParticleBuilder allPlayers()`
- `@NotNull public @NotNull ParticleBuilder receivers(@Nullable @Nullable List<Player> receivers)`
- `@NotNull public @NotNull ParticleBuilder receivers(@Nullable @Nullable Collection<Player> receivers)`
- `@NotNull public @NotNull ParticleBuilder receivers(@Nullable @Nullable Player... receivers)`
- `@NotNull public @NotNull ParticleBuilder receivers(int radius)`
- `@NotNull public @NotNull ParticleBuilder receivers(int radius, boolean byDistance)`
- `@NotNull public @NotNull ParticleBuilder receivers(int xzRadius, int yRadius)`
- `@NotNull public @NotNull ParticleBuilder receivers(int xzRadius, int yRadius, boolean byDistance)`
- `@NotNull public @NotNull ParticleBuilder receivers(int xRadius, int yRadius, int zRadius)`
- `@Nullable public @Nullable Player source()`
- `@NotNull public @NotNull ParticleBuilder source(@Nullable @Nullable Player source)`
- `@Nullable public @Nullable Location location()`
- `@NotNull public @NotNull ParticleBuilder location(@NotNull @NotNull Location location)`
- `@NotNull public @NotNull ParticleBuilder location(@NotNull @NotNull World world, double x, double y, double z)`
- `public int count()`
- `@NotNull public @NotNull ParticleBuilder count(int count)`
- `public double offsetX()`
- `public double offsetY()`
- `public double offsetZ()`
- `@NotNull public @NotNull ParticleBuilder offset(double offsetX, double offsetY, double offsetZ)`
- `public double extra()`
- `@NotNull public @NotNull ParticleBuilder extra(double extra)`
- `@Nullable public <T> T data()`
- `@NotNull public <T> @NotNull ParticleBuilder data(@Nullable T data)`
- `public boolean force()`
- `@NotNull public @NotNull ParticleBuilder force(boolean force)`
- `@NotNull public @NotNull ParticleBuilder color(@Nullable @Nullable Color color)`
- `@NotNull public @NotNull ParticleBuilder color(@Nullable @Nullable Color color, float size)`
- `@NotNull public @NotNull ParticleBuilder color(int r, int g, int b)`
