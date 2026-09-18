# ServerStatusResponse

## Class signature

```java
public class ServerStatusResponse extends java.lang.Object
```

## Constructors

- `public ServerStatusResponse()`

## Methods

- `public ITextComponent getServerDescription()`
- `public void setServerDescription( ITextComponent descriptionIn)`
- `public ServerStatusResponse.Players getPlayers()`
- `public void setPlayers( ServerStatusResponse.Players playersIn)`
- `public ServerStatusResponse.Version getVersion()`
- `public void setVersion( ServerStatusResponse.Version versionIn)`
- `public void setFavicon(java.lang.String faviconBlob)`
- `public java.lang.String getFavicon()`
- `public java.lang.String getJson()`
- `public void invalidateJson()`

## Description

Returns this object as a Json string.