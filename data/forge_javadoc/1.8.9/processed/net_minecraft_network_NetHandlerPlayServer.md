# NetHandlerPlayServer

## Class signature

```java
public class NetHandlerPlayServer extends java.lang.Object implements INetHandlerPlayServer , ITickable
```

## Constructors

- `public NetHandlerPlayServer( MinecraftServer server, NetworkManager networkManagerIn, EntityPlayerMP playerIn)`

## Methods

- `public void update()`
- `public NetworkManager getNetworkManager()`
- `public void kickPlayerFromServer(java.lang.String reason)`
- `public void processInput( C0CPacketInput packetIn)`
- `public void processPlayer( C03PacketPlayer packetIn)`
- `public void setPlayerLocation(double x, double y, double z, float yaw, float pitch)`
- `public void setPlayerLocation(double x, double y, double z, float yaw, float pitch, java.util.Set< S08PacketPlayerPosLook.EnumFlags > relativeSet)`
- `public void processPlayerDigging( C07PacketPlayerDigging packetIn)`
- `public void processPlayerBlockPlacement( C08PacketPlayerBlockPlacement packetIn)`
- `public void handleSpectate( C18PacketSpectate packetIn)`
- `public void handleResourcePackStatus( C19PacketResourcePackStatus packetIn)`
- `public void onDisconnect( IChatComponent reason)`
- `public void sendPacket( Packet packetIn)`
- `public void processHeldItemChange( C09PacketHeldItemChange packetIn)`
- `public void processChatMessage( C01PacketChatMessage packetIn)`
- `public void handleAnimation( C0APacketAnimation packetIn)`
- `public void processEntityAction( C0BPacketEntityAction packetIn)`
- `public void processUseEntity( C02PacketUseEntity packetIn)`
- `public void processClientStatus( C16PacketClientStatus packetIn)`
- `public void processCloseWindow( C0DPacketCloseWindow packetIn)`
- `public void processClickWindow( C0EPacketClickWindow packetIn)`
- `public void processEnchantItem( C11PacketEnchantItem packetIn)`
- `public void processCreativeInventoryAction( C10PacketCreativeInventoryAction packetIn)`
- `public void processConfirmTransaction( C0FPacketConfirmTransaction packetIn)`
- `public void processUpdateSign( C12PacketUpdateSign packetIn)`
- `public void processKeepAlive( C00PacketKeepAlive packetIn)`
- `public void processPlayerAbilities( C13PacketPlayerAbilities packetIn)`
- `public void processTabComplete( C14PacketTabComplete packetIn)`
- `public void processClientSettings( C15PacketClientSettings packetIn)`
- `public void processVanilla250Packet( C17PacketCustomPayload packetIn)`

## Description

Kick a player from the server with a reason