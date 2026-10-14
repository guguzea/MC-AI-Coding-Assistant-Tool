---
title: "com.destroystokyo.paper.exception.ServerEventException"
package: "com.destroystokyo.paper.exception"
source: https://jd.papermc.io/paper/26.3/com/destroystokyo/paper/exception/ServerEventException.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class ServerEventException**
`public class ServerEventException extends ServerPluginException`
- `public ServerEventException(String message, Throwable cause, Plugin responsiblePlugin, Listener listener, Event event)`
- `public ServerEventException(Throwable cause, Plugin responsiblePlugin, Listener listener, Event event)`
- `protected ServerEventException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace, Plugin responsiblePlugin, Listener listener, Event event)`
- `public Listener getListener()`
- `public Event getEvent()`
