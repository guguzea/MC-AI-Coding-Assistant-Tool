# DedicatedPlayerList

**Inheritance:** java.lang.Object → net.minecraft.server.management.PlayerList → net.minecraft.server.dedicated.DedicatedPlayerList

## Class signature

```java
public class DedicatedPlayerList extends PlayerList
```

## Methods

- `void addOp(com.mojang.authlib.GameProfile profile)`
- `void addWhitelistedPlayer(com.mojang.authlib.GameProfile profile)`
- `boolean bypassesPlayerLimit(com.mojang.authlib.GameProfile profile)`
- `boolean canJoin(com.mojang.authlib.GameProfile profile)`
- `DedicatedServer getServerInstance()`
- `void reloadWhitelist()`
- `void removeOp(com.mojang.authlib.GameProfile profile)`
- `void removePlayerFromWhitelist(com.mojang.authlib.GameProfile profile)`
- `void setWhiteListEnabled(boolean whitelistEnabled)`

## Fields

- `DedicatedPlayerList`