---
title: "co.aikar.timings.TimingsReportListener"
package: "co.aikar.timings"
source: https://jd.papermc.io/paper/1.20.1/co/aikar/timings/TimingsReportListener.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `public TimingsReportListener(@NotNull @NotNull CommandSender senders)`
- `public TimingsReportListener(@NotNull @NotNull CommandSender sender, @Nullable @Nullable Runnable onDone)`
- `public TimingsReportListener(@NotNull @NotNull List<CommandSender> senders)`
- `public TimingsReportListener(@NotNull @NotNull List<CommandSender> senders, @Nullable @Nullable Runnable onDone)`
- `@Nullable public @Nullable String getTimingsURL()`
- `public void done()`
- `public void done(@Nullable @Nullable String url)`
- `public void sendMessage(@NotNull Identity source, @NotNull Component message, @NotNull MessageType type)`
- `@NotNull public @NotNull Iterable<? extends Audience> audiences()`
- `public void sendMessage(@NotNull @NotNull String message)`
- `public void addConsoleIfNeeded()`
