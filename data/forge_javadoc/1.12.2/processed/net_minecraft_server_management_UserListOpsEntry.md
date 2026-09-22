# UserListOpsEntry

**Inheritance:** java.lang.Object → net.minecraft.server.management.UserListEntry<GameProfile> → net.minecraft.server.management.UserListOpsEntry

## Class signature

```java
public class UserListOpsEntry extends UserListEntry<GameProfile>
```

## Constructors

- `UserListOpsEntry(GameProfile player, int permissionLevelIn, boolean bypassesPlayerLimitIn)`
- `UserListOpsEntry(JsonObject p_i1150_1_)`

## Methods

- `boolean bypassesPlayerLimit()`
- `int getPermissionLevel()`
- `protected void onSerialization(JsonObject data)`