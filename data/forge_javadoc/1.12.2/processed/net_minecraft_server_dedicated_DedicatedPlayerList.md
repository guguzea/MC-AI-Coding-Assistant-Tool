# DedicatedPlayerList

## Class signature

```java
public class DedicatedPlayerList extends PlayerList
```

## Constructors

- `public DedicatedPlayerList( DedicatedServer server)`

## Methods

- `public void setWhiteListEnabled(boolean whitelistEnabled)`
- `public void addOp(GameProfile profile)`
- `public void removeOp(GameProfile profile)`
- `public void removePlayerFromWhitelist(GameProfile profile)`
- `public void addWhitelistedPlayer(GameProfile profile)`
- `public void reloadWhitelist()`
- `public boolean canJoin(GameProfile profile)`
- `public DedicatedServer getServerInstance()`
- `public boolean bypassesPlayerLimit(GameProfile profile)`