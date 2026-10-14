---
title: "io.papermc.paper.util.Tick"
package: "io.papermc.paper.util"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/util/Tick.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class Tick**
`@NullMarked public final class Tick extends Object implements TemporalUnit`
- `public static Tick tick()`
- `public static Duration of(long ticks)`
- `public int fromDuration(Duration duration)`
- `public Duration getDuration()`
- `public boolean isDurationEstimated()`
- `public boolean isDateBased()`
- `public boolean isTimeBased()`
- `public <R extends Temporal> R addTo(R temporal, long amount)`
- `public long between(Temporal start, Temporal end)`
