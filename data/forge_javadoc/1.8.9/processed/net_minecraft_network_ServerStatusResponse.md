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