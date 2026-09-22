---
title: "ServerStatusResponse"
description: "public class ServerStatusResponse extends java.lang.Object"
package: "net/minecraft/network"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/network/ServerStatusResponse.html"
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
- `ServerStatusResponse.Players getPlayers()`
- `ITextComponent getServerDescription()`
- `ServerStatusResponse.Version getVersion()`
- `void invalidateJson()` — Invalidates the cached json, causing the next call to getJson to rebuild it.
- `void setFavicon(java.lang.String faviconBlob)`
- `void setPlayers(ServerStatusResponse.Players playersIn)`
- `void setServerDescription(ITextComponent descriptionIn)`
- `void setVersion(ServerStatusResponse.Version versionIn)`
