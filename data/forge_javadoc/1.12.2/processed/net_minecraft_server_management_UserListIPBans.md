# UserListIPBans

## Class signature

```java
public class UserListIPBans extends UserList <java.lang.String, UserListIPBansEntry >
```

## Constructors

- `public UserListIPBans(java.io.File bansFile)`

## Methods

- `protected UserListEntry <java.lang.String> createEntry(JsonObject entryData)`
- `public boolean isBanned(java.net.SocketAddress address)`
- `public UserListIPBansEntry getBanEntry(java.net.SocketAddress address)`