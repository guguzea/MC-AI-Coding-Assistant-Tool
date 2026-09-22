# ServerStatusResponse.Players

**Inheritance:** java.lang.Object → net.minecraft.network.ServerStatusResponse.Players

## Class signature

```java
public static class ServerStatusResponse.Players extends java.lang.Object
```

## Constructors

- `Players(int maxOnlinePlayers, int onlinePlayers)`

## Methods

- `int getMaxPlayers()`
- `int getOnlinePlayerCount()`
- `com.mojang.authlib.GameProfile[] getPlayers()`
- `void setPlayers(com.mojang.authlib.GameProfile[] playersIn)`