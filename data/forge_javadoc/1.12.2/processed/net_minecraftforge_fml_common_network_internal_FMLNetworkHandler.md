# FMLNetworkHandler

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.network.internal.FMLNetworkHandler

## Class signature

```java
public class FMLNetworkHandler extends java.lang.Object
```

## Constructors

- `FMLNetworkHandler()`

## Methods

- `static java.lang.String checkModList(FMLHandshakeMessage.ModList modListPacket, Side side)`
- `static java.lang.String checkModList(java.util.Map<java.lang.String, java.lang.String> listData, Side side)`
- `static void enhanceStatusQuery(JsonObject jsonobject)`
- `static void fmlClientHandshake(NetworkManager networkManager)`
- `static void fmlServerHandshake(PlayerList scm, NetworkManager manager, EntityPlayerMP player)`
- `static java.util.List<FMLProxyPacket> forwardHandshake(FMLMessage.CompleteHandshake push, NetworkDispatcher target, Side side)`
- `static Packet<?> getEntitySpawningPacket(Entity entity)`
- `static void openGui(EntityPlayer entityPlayer, java.lang.Object mod, int modGuiId, World world, int x, int y, int z)`
- `static void registerChannel(FMLContainer container, Side side)`

## Fields

- `static int LOGIN_TIMEOUT`
- `static int READ_TIMEOUT`