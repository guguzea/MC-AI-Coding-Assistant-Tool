---
title: "com.destroystokyo.paper.ParticleBuilder"
package: "com.destroystokyo.paper"
source: https://jd.papermc.io/paper/1.21.4/com/destroystokyo/paper/ParticleBuilder.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `public ParticleBuilder(Particle particle)`
- `public ParticleBuilder spawn()`
- `public Particle particle()`
- `public ParticleBuilder particle(Particle particle)`
- `public @Nullable List<Player> receivers()`
- `public boolean hasReceivers()`
- `public ParticleBuilder allPlayers()`
- `public ParticleBuilder receivers(@Nullable List<Player> receivers)`
- `public ParticleBuilder receivers(@Nullable Collection<Player> receivers)`
- `public ParticleBuilder receivers(Player @Nullable ... receivers)`
- `public ParticleBuilder receivers(int radius)`
- `public ParticleBuilder receivers(int radius, boolean byDistance)`
- `public ParticleBuilder receivers(int xzRadius, int yRadius)`
- `public ParticleBuilder receivers(int xzRadius, int yRadius, boolean byDistance)`
- `public ParticleBuilder receivers(int xRadius, int yRadius, int zRadius)`
- `public @Nullable Player source()`
- `public ParticleBuilder source(@Nullable Player source)`
- `public @Nullable Location location()`
- `public ParticleBuilder location(Location location)`
- `public ParticleBuilder location(World world, double x, double y, double z)`
- `public int count()`
- `public ParticleBuilder count(int count)`
- `public double offsetX()`
- `public double offsetY()`
- `public double offsetZ()`
- `public ParticleBuilder offset(double offsetX, double offsetY, double offsetZ)`
- `public double extra()`
- `public ParticleBuilder extra(double extra)`
- `public <T> @Nullable T data()`
- `public <T> ParticleBuilder data(@Nullable T data)`
- `public boolean force()`
- `public ParticleBuilder force(boolean force)`
- `public ParticleBuilder color(@Nullable Color color)`
- `public ParticleBuilder color(@Nullable Color color, float size)`
- `public ParticleBuilder color(int r, int g, int b)`
- `public ParticleBuilder color(int color)`
- `public ParticleBuilder color(int a, int r, int g, int b)`
- `public ParticleBuilder colorTransition(Color fromColor, Color toColor)`
- `public ParticleBuilder colorTransition(int fromRed, int fromGreen, int fromBlue, int toRed, int toGreen, int toBlue)`
- `public ParticleBuilder colorTransition(int fromRgb, int toRgb)`
- `public ParticleBuilder colorTransition(Color fromColor, Color toColor, float size)`
- `public ParticleBuilder clone()`
