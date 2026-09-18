# FMLNetworkHandler

## Class signature

```java
public class FMLNetworkHandler extends java.lang.Object
```

## Constructors

- `public FMLNetworkHandler()`

## Methods

- `public static void fmlServerHandshake( ServerConfigurationManager scm, NetworkManager manager, EntityPlayerMP player)`
- `public static void fmlClientHandshake( NetworkManager networkManager)`
- `public static void openGui( EntityPlayer entityPlayer, java.lang.Object mod, int modGuiId, World world, int x, int y, int z)`
- `public static void makeEntitySpawnAdjustment( Entity entity, EntityPlayerMP player, int serverX, int serverY, int serverZ)`
- `public static Packet <?> getEntitySpawningPacket( Entity entity)`
- `public static java.lang.String checkModList( FMLHandshakeMessage.ModList modListPacket, Side side)`
- `public static java.lang.String checkModList(java.util.Map<java.lang.String,java.lang.String> listData, Side side)`
- `public static void registerChannel( FMLContainer container, Side side)`
- `public static java.util.List< FMLProxyPacket > forwardHandshake( FMLMessage.CompleteHandshake push, NetworkDispatcher target, Side side)`
- `public static void enhanceStatusQuery(JsonObject jsonobject)`