---
title: "io.papermc.paper.util.Tick"
package: "io.papermc.paper.util"
source: https://jd.papermc.io/paper/1.20.1/io/papermc/paper/util/Tick.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `@NotNull public static @NotNull Tick tick()`
- `@NotNull public static @NotNull Duration of(long ticks)`
- `public int fromDuration(@NotNull @NotNull Duration duration)`
- `@NotNull public @NotNull Duration getDuration()`
- `public boolean isDurationEstimated()`
- `public boolean isDateBased()`
- `public boolean isTimeBased()`
- `@NotNull public <R extends Temporal> R addTo(@NotNull R temporal, long amount)`
- `public long between(@NotNull @NotNull Temporal start, @NotNull @NotNull Temporal end)`
