# UserListIPBans

**Inheritance:** java.lang.Object → net.minecraft.server.management.UserList<java.lang.String, UserListIPBansEntry> → net.minecraft.server.management.UserListIPBans

## Class signature

```java
public class UserListIPBans extends UserList<java.lang.String, UserListIPBansEntry>
```

## Methods

- `protected UserListEntry<java.lang.String> createEntry(JsonObject entryData)`
- `UserListIPBansEntry getBanEntry(java.net.SocketAddress address)`
- `boolean isBanned(java.net.SocketAddress address)`

## Fields

- `UserListIPBans`