# NetHandlerPlayServer

## Class signature

```java
public class NetHandlerPlayServer extends java.lang.Object implements INetHandlerPlayServer
```

## Constructors

- `public NetHandlerPlayServer( MinecraftServer p_i1530_1_, NetworkManager p_i1530_2_, EntityPlayerMP p_i1530_3_)`

## Methods

- `public void onNetworkTick()`
- `public NetworkManager func_147362_b()`
- `public void kickPlayerFromServer(java.lang.String p_147360_1_)`
- `public void processInput( C0CPacketInput p_147358_1_)`
- `public void processPlayer( C03PacketPlayer p_147347_1_)`
- `public void setPlayerLocation(double p_147364_1_, double p_147364_3_, double p_147364_5_, float p_147364_7_, float p_147364_8_)`
- `public void processPlayerDigging( C07PacketPlayerDigging p_147345_1_)`
- `public void processPlayerBlockPlacement( C08PacketPlayerBlockPlacement p_147346_1_)`
- `public void onDisconnect( IChatComponent p_147231_1_)`
- `public void sendPacket( Packet p_147359_1_)`
- `public void processHeldItemChange( C09PacketHeldItemChange p_147355_1_)`
- `public void processChatMessage( C01PacketChatMessage p_147354_1_)`
- `public void processAnimation( C0APacketAnimation p_147350_1_)`
- `public void processEntityAction( C0BPacketEntityAction p_147357_1_)`
- `public void processUseEntity( C02PacketUseEntity p_147340_1_)`
- `public void processClientStatus( C16PacketClientStatus p_147342_1_)`
- `public void processCloseWindow( C0DPacketCloseWindow p_147356_1_)`
- `public void processClickWindow( C0EPacketClickWindow p_147351_1_)`
- `public void processEnchantItem( C11PacketEnchantItem p_147338_1_)`
- `public void processCreativeInventoryAction( C10PacketCreativeInventoryAction p_147344_1_)`
- `public void processConfirmTransaction( C0FPacketConfirmTransaction p_147339_1_)`
- `public void processUpdateSign( C12PacketUpdateSign p_147343_1_)`
- `public void processKeepAlive( C00PacketKeepAlive p_147353_1_)`
- `public void processPlayerAbilities( C13PacketPlayerAbilities p_147348_1_)`
- `public void processTabComplete( C14PacketTabComplete p_147341_1_)`
- `public void processClientSettings( C15PacketClientSettings p_147352_1_)`
- `public void processVanilla250Packet( C17PacketCustomPayload p_147349_1_)`
- `public void onConnectionStateTransition( EnumConnectionState p_147232_1_, EnumConnectionState p_147232_2_)`