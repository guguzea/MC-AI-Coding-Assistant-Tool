# ServerList

**Inheritance:** java.lang.Object → net.minecraft.client.multiplayer.ServerList

## Class signature

```java
public class ServerList extends java.lang.Object
```

## Constructors

- `ServerList(Minecraft mcIn)`

## Methods

- `void addServerData(ServerData p_78849_1_)` — Adds the given ServerData instance to the list.
- `int countServers()` — Counts the number of ServerData instances in the list.
- `void func_147413_a(int p_147413_1_, ServerData p_147413_2_)`
- `static void func_147414_b(ServerData p_147414_0_)`
- `ServerData getServerData(int p_78850_1_)` — Gets the ServerData instance stored for the given index in the list.
- `void loadServerList()` — Loads a list of servers from servers.dat, by running ServerData.getServerDataFromNBTCompound on each NBT compound found in the "servers" tag list.
- `void removeServerData(int p_78851_1_)` — Removes the ServerData instance stored for the given index in the list.
- `void saveServerList()` — Runs getNBTCompound on each ServerData instance, puts everything into a "servers" NBT list and writes it to servers.dat.
- `void swapServers(int p_78857_1_, int p_78857_2_)` — Takes two list indexes, and swaps their order around.