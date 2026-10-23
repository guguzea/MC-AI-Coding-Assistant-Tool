---
title: "com.destroystokyo.paper.event.profile.ProfileWhitelistVerifyEvent"
package: "com.destroystokyo.paper.event.profile"
source: https://jd.papermc.io/paper/1.20.1/com/destroystokyo/paper/event/profile/ProfileWhitelistVerifyEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `@Deprecated public ProfileWhitelistVerifyEvent(@NotNull @NotNull PlayerProfile profile, boolean whitelistEnabled, boolean whitelisted, boolean isOp, @Nullable @Nullable String kickMessage)`
- `public ProfileWhitelistVerifyEvent(@NotNull @NotNull PlayerProfile profile, boolean whitelistEnabled, boolean whitelisted, boolean isOp, @Nullable @Nullable Component kickMessage)`
- `@Deprecated @Nullable public @Nullable String getKickMessage()`
- `@Deprecated public void setKickMessage(@Nullable @Nullable String kickMessage)`
- `@Nullable public @Nullable Component kickMessage()`
- `public void kickMessage(@Nullable @Nullable Component kickMessage)`
- `@NotNull public @NotNull PlayerProfile getPlayerProfile()`
- `public boolean isWhitelisted()`
- `public void setWhitelisted(boolean whitelisted)`
- `public boolean isOp()`
- `public boolean isWhitelistEnabled()`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
