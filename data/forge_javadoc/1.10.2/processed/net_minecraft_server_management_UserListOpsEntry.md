# UserListOpsEntry

## Class signature

```java
public class UserListOpsEntry extends UserListEntry <com.mojang.authlib.GameProfile>
```

## Constructors

- `public UserListOpsEntry(com.mojang.authlib.GameProfile player, int permissionLevelIn, boolean bypassesPlayerLimitIn)`
- `public UserListOpsEntry(com.google.gson.JsonObject p_i1150_1_)`

## Methods

- `public int getPermissionLevel()`
- `public boolean bypassesPlayerLimit()`
- `protected void onSerialization(com.google.gson.JsonObject data)`