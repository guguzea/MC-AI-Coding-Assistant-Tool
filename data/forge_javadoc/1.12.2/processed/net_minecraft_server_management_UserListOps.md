# UserListOps

**Inheritance:** java.lang.Object → net.minecraft.server.management.UserList<GameProfile, UserListOpsEntry> → net.minecraft.server.management.UserListOps

## Class signature

```java
public class UserListOps extends UserList<GameProfile, UserListOpsEntry>
```

## Methods

- `boolean bypassesPlayerLimit(GameProfile profile)`
- `protected UserListEntry<GameProfile> createEntry(JsonObject entryData)`
- `GameProfile getGameProfileFromName(java.lang.String username)`
- `java.lang.String[] getKeys()`
- `protected java.lang.String getObjectKey(GameProfile obj)`
- `int getPermissionLevel(GameProfile profile)`

## Fields

- `UserListOps`