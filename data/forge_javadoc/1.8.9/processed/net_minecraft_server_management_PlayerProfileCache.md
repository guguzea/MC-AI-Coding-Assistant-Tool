# PlayerProfileCache

**Inheritance:** java.lang.Object → net.minecraft.server.management.PlayerProfileCache

## Class signature

```java
public class PlayerProfileCache extends java.lang.Object
```

## Constructors

- `PlayerProfileCache(MinecraftServer server, java.io.File cacheFile)`

## Methods

- `void addEntry(GameProfile gameProfile)` — Add an entry to this cache
- `GameProfile getGameProfileForUsername(java.lang.String username)` — Get a player's GameProfile given their username.
- `GameProfile getProfileByUUID(java.util.UUID uuid)` — Get a player's GameProfile given their UUID
- `java.lang.String[] getUsernames()` — Get an array of the usernames that are cached in this cache
- `void load()` — Load the cached profiles from disk
- `void save()` — Save the cached profiles to disk

## Fields

- `static java.text.SimpleDateFormat dateFormat`
- `protected Gson gson`