---
title: "com.destroystokyo.paper.event.profile.PreLookupProfileEvent"
package: "com.destroystokyo.paper.event.profile"
source: https://jd.papermc.io/paper/26.3/com/destroystokyo/paper/event/profile/PreLookupProfileEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PreLookupProfileEvent**
`@NullMarked public class PreLookupProfileEvent extends Event`
- `@Internal public PreLookupProfileEvent(String name)`
- `public String getName()`
- `public @Nullable UUID getUUID()`
- `public void setUUID(@Nullable UUID uuid)`
- `@Deprecated(forRemoval=true, since="1.21.9") public Set<ProfileProperty> getProfileProperties()`
- `@Deprecated(forRemoval=true, since="1.21.9") public void setProfileProperties(Set<ProfileProperty> properties)`
- `@Deprecated(forRemoval=true, since="1.21.9") public void addProfileProperties(Set<ProfileProperty> properties)`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
