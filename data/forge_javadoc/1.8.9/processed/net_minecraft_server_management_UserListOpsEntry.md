# UserListOpsEntry

**Inheritance:** java.lang.Object → net.minecraft.server.management.UserListEntry<GameProfile> → net.minecraft.server.management.UserListOpsEntry

## Class signature

```java
public class UserListOpsEntry extends UserListEntry<GameProfile>
```

## Constructors

- `UserListOpsEntry(GameProfile p_i46492_1_, int p_i46492_2_, boolean p_i46492_3_)`
- `UserListOpsEntry(JsonObject p_i1150_1_)`

## Methods

- `boolean func_183024_b()`
- `int getPermissionLevel()` — Gets the permission level of the user, as defined in the "level" attribute of the ops.json file
- `protected void onSerialization(JsonObject data)`