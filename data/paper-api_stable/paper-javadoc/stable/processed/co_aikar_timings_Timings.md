---
title: "co.aikar.timings.Timings"
package: "co.aikar.timings"
source: https://jd.papermc.io/paper/26.3/co/aikar/timings/Timings.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class Timings**
`@Deprecated(forRemoval=true) public final class Timings extends Object`
- `public static final Timing NULL_HANDLER`
- `@NotNull public static @NotNull Timing of(@NotNull @NotNull Plugin plugin, @NotNull @NotNull String name)`
- `@NotNull public static @NotNull Timing of(@NotNull @NotNull Plugin plugin, @NotNull @NotNull String name, @Nullable @Nullable Timing groupHandler)`
- `@NotNull public static @NotNull Timing ofStart(@NotNull @NotNull Plugin plugin, @NotNull @NotNull String name)`
- `@NotNull public static @NotNull Timing ofStart(@NotNull @NotNull Plugin plugin, @NotNull @NotNull String name, @Nullable @Nullable Timing groupHandler)`
- `public static boolean isTimingsEnabled()`
- `public static void setTimingsEnabled(boolean enabled)`
- `public static Component deprecationMessage()`
- `public static boolean isVerboseTimingsEnabled()`
- `public static void setVerboseTimingsEnabled(boolean enabled)`
- `public static int getHistoryInterval()`
- `public static void setHistoryInterval(int interval)`
- `public static int getHistoryLength()`
- `public static void setHistoryLength(int length)`
- `public static void reset()`
- `public static void generateReport(@Nullable @Nullable CommandSender sender)`
- `public static void generateReport(@NotNull @NotNull TimingsReportListener sender)`
