---
title: "co.aikar.timings.TimingsReportListener"
package: "co.aikar.timings"
source: https://jd.papermc.io/paper/26.3/co/aikar/timings/TimingsReportListener.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class TimingsReportListener**
`@Deprecated(forRemoval=true) public class TimingsReportListener extends Object implements ForwardingAudience, MessageCommandSender`
- `public TimingsReportListener(@NotNull @NotNull CommandSender senders)`
- `public TimingsReportListener(@NotNull @NotNull CommandSender sender, @Nullable @Nullable Runnable onDone)`
- `public TimingsReportListener(@NotNull @NotNull List<CommandSender> senders)`
- `public TimingsReportListener(@NotNull @NotNull List<CommandSender> senders, @Nullable @Nullable Runnable onDone)`
- `@Nullable public @Nullable String getTimingsURL()`
- `public void done()`
- `public void done(@Nullable @Nullable String url)`
- `public void sendMessage(@NotNull @NotNull Component message)`
- `public void sendMessage(@NotNull @NotNull Component message, @NotNull ChatType.Bound boundChatType)`
- `public void sendMessage(@NotNull @NotNull SignedMessage signedMessage, @NotNull ChatType.Bound boundChatType)`
- `@NotNull public @NotNull Iterable<? extends Audience> audiences()`
- `public void sendMessage(@NotNull @NotNull String message)`
- `public void addConsoleIfNeeded()`
