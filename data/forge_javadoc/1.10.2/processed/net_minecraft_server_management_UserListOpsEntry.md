# UserListOpsEntry

**Inheritance:** java.lang.Object → net.minecraft.server.management.UserListEntry<com.mojang.authlib.GameProfile> → net.minecraft.server.management.UserListOpsEntry

## Class signature

```java
public class UserListOpsEntry extends UserListEntry<com.mojang.authlib.GameProfile>
```

## Constructors

- `UserListOpsEntry(com.mojang.authlib.GameProfile player, int permissionLevelIn, boolean bypassesPlayerLimitIn)`
- `UserListOpsEntry(com.google.gson.JsonObject p_i1150_1_)`

## Methods

- `boolean bypassesPlayerLimit()`
- `int getPermissionLevel()`
- `protected void onSerialization(com.google.gson.JsonObject data)`