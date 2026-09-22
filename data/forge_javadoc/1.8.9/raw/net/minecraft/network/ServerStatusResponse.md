---
title: "ServerStatusResponse"
description: "public class ServerStatusResponse extends java.lang.Object"
package: "net/minecraft/network"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/ServerStatusResponse.html"
sourceType: javadoc
---

# ServerStatusResponse

**Inheritance:** java.lang.Object → net.minecraft.network.ServerStatusResponse

## Class signature

```java
public class ServerStatusResponse extends java.lang.Object
```

## Constructors

- `ServerStatusResponse()`

## Methods

- `java.lang.String getFavicon()`
- `java.lang.String getJson()` — Returns this object as a Json string.
- `ServerStatusResponse.PlayerCountData getPlayerCountData()`
- `ServerStatusResponse.MinecraftProtocolVersionIdentifier getProtocolVersionInfo()`
- `IChatComponent getServerDescription()`
- `void invalidateJson()` — Invalidates the cached json, causing the next call to getJson to rebuild it.
- `void setFavicon(java.lang.String faviconBlob)`
- `void setPlayerCountData(ServerStatusResponse.PlayerCountData countData)`
- `void setProtocolVersionInfo(ServerStatusResponse.MinecraftProtocolVersionIdentifier protocolVersionData)`
- `void setServerDescription(IChatComponent motd)`
