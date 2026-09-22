# UsernameCache

**Inheritance:** java.lang.Object → net.minecraftforge.common.UsernameCache

## Class signature

```java
public final class UsernameCache extends java.lang.Object
```

## Methods

- `static boolean containsUUID(java.util.UUID uuid)` — Check if the cache contains the given player's username
- `static java.lang.String getLastKnownUsername(java.util.UUID uuid)` — Get the player's last known username May be null
- `static java.util.Map<java.util.UUID, java.lang.String> getMap()` — Get an immutable copy of the cache's underlying map
- `protected static void load()` — Load the cache from file
- `protected static boolean removeUsername(java.util.UUID uuid)` — Remove a player's username from the cache
- `protected static void save()` — Save the cache to file
- `protected static void setUsername(java.util.UUID uuid, java.lang.String username)` — Set a player's current username