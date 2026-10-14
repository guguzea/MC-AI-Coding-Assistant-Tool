---
title: "co.aikar.timings.Timing"
package: "co.aikar.timings"
source: https://jd.papermc.io/paper/26.3/co/aikar/timings/Timing.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface Timing**
`@Deprecated(forRemoval=true) public interface Timing extends AutoCloseable`
- `@NotNull @NotNull Timing startTiming()`
- `void stopTiming()`
- `@NotNull @NotNull Timing startTimingIfSync()`
- `void stopTimingIfSync()`
- `@Deprecated void abort()`
- `@Nullable @Nullable co.aikar.timings.TimingHandler getTimingHandler()`
- `void close()`
