---
title: "com.destroystokyo.paper.event.profile.ProfileWhitelistVerifyEvent"
package: "com.destroystokyo.paper.event.profile"
source: https://jd.papermc.io/paper/26.3/com/destroystokyo/paper/event/profile/ProfileWhitelistVerifyEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class ProfileWhitelistVerifyEvent**
`@NullMarked public class ProfileWhitelistVerifyEvent extends Event`
- `@Internal public ProfileWhitelistVerifyEvent(PlayerProfile profile, boolean whitelistEnabled, boolean whitelisted, boolean isOp, @Nullable Component kickMessage)`
- `@Deprecated public @Nullable String getKickMessage()`
- `@Deprecated public void setKickMessage(@Nullable String kickMessage)`
- `@Contract(pure=true) public @Nullable Component kickMessage()`
- `public void kickMessage(@Nullable Component kickMessage)`
- `public PlayerProfile getPlayerProfile()`
- `public boolean isWhitelisted()`
- `public void setWhitelisted(boolean whitelisted)`
- `public boolean isOp()`
- `public boolean isWhitelistEnabled()`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
