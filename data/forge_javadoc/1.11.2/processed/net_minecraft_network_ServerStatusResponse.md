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