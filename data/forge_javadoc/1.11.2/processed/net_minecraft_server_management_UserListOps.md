# UserListOps

**Inheritance:** java.lang.Object → net.minecraft.server.management.UserList<com.mojang.authlib.GameProfile, UserListOpsEntry> → net.minecraft.server.management.UserListOps

## Class signature

```java
public class UserListOps extends UserList<com.mojang.authlib.GameProfile, UserListOpsEntry>
```

## Methods

- `boolean bypassesPlayerLimit(com.mojang.authlib.GameProfile profile)`
- `protected UserListEntry<com.mojang.authlib.GameProfile> createEntry(com.google.gson.JsonObject entryData)`
- `com.mojang.authlib.GameProfile getGameProfileFromName(java.lang.String username)`
- `java.lang.String[] getKeys()`
- `protected java.lang.String getObjectKey(com.mojang.authlib.GameProfile obj)`
- `int getPermissionLevel(com.mojang.authlib.GameProfile profile)`

## Fields

- `UserListOps`