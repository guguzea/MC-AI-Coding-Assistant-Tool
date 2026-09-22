# DedicatedPlayerList

**Inheritance:** java.lang.Object → net.minecraft.server.management.ServerConfigurationManager → net.minecraft.server.dedicated.DedicatedPlayerList

## Class signature

```java
public class DedicatedPlayerList extends ServerConfigurationManager
```

## Methods

- `void addOp(GameProfile profile)`
- `void addWhitelistedPlayer(GameProfile profile)`
- `boolean canJoin(GameProfile profile)`
- `boolean func_183023_f(GameProfile p_183023_1_)`
- `DedicatedServer getServerInstance()`
- `void loadWhiteList()` — Either does nothing, or calls readWhiteList.
- `void removeOp(GameProfile profile)`
- `void removePlayerFromWhitelist(GameProfile profile)`
- `void setWhiteListEnabled(boolean whitelistEnabled)`

## Fields

- `DedicatedPlayerList`