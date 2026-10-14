---
title: "com.destroystokyo.paper.event.server.GS4QueryEvent"
package: "com.destroystokyo.paper.event.server"
source: https://jd.papermc.io/paper/26.3/com/destroystokyo/paper/event/server/GS4QueryEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class GS4QueryEvent**
`@NullMarked public final class GS4QueryEvent extends Event`
- `@Internal public GS4QueryEvent(GS4QueryEvent.QueryType queryType, InetAddress querierAddress, GS4QueryEvent.QueryResponse response)`
- `public GS4QueryEvent.QueryType getQueryType()`
- `public InetAddress getQuerierAddress()`
- `public GS4QueryEvent.QueryResponse getResponse()`
- `public void setResponse(GS4QueryEvent.QueryResponse response)`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
