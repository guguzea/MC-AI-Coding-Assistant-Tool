# NetHandlerPlayServer

**Inheritance:** java.lang.Object → net.minecraft.network.NetHandlerPlayServer

## Class signature

```java
public class NetHandlerPlayServer extends java.lang.Object implements INetHandlerPlayServer, ITickable
```

## Constructors

- `NetHandlerPlayServer(MinecraftServer server, NetworkManager networkManagerIn, EntityPlayerMP playerIn)`

## Methods

- `void disconnect(ITextComponent textComponent)`
- `void func_194308_a(CPacketPlaceRecipe p_194308_1_)`
- `NetworkManager getNetworkManager()`
- `void handleAnimation(CPacketAnimation packetIn)`
- `void handleRecipeBookUpdate(CPacketRecipeInfo p_191984_1_)`
- `void handleResourcePackStatus(CPacketResourcePackStatus packetIn)`
- `void handleSeenAdvancements(CPacketSeenAdvancements p_194027_1_)`
- `void handleSpectate(CPacketSpectate packetIn)`
- `void onDisconnect(ITextComponent reason)`
- `void processChatMessage(CPacketChatMessage packetIn)`
- `void processClickWindow(CPacketClickWindow packetIn)`
- `void processClientSettings(CPacketClientSettings packetIn)`
- `void processClientStatus(CPacketClientStatus packetIn)`
- `void processCloseWindow(CPacketCloseWindow packetIn)`
- `void processConfirmTeleport(CPacketConfirmTeleport packetIn)`
- `void processConfirmTransaction(CPacketConfirmTransaction packetIn)`
- `void processCreativeInventoryAction(CPacketCreativeInventoryAction packetIn)`
- `void processCustomPayload(CPacketCustomPayload packetIn)`
- `void processEnchantItem(CPacketEnchantItem packetIn)`
- `void processEntityAction(CPacketEntityAction packetIn)`
- `void processHeldItemChange(CPacketHeldItemChange packetIn)`
- `void processInput(CPacketInput packetIn)`
- `void processKeepAlive(CPacketKeepAlive packetIn)`
- `void processPlayer(CPacketPlayer packetIn)`
- `void processPlayerAbilities(CPacketPlayerAbilities packetIn)`
- `void processPlayerDigging(CPacketPlayerDigging packetIn)`
- `void processSteerBoat(CPacketSteerBoat packetIn)`
- `void processTabComplete(CPacketTabComplete packetIn)`
- `void processTryUseItem(CPacketPlayerTryUseItem packetIn)`
- `void processTryUseItemOnBlock(CPacketPlayerTryUseItemOnBlock packetIn)`
- `void processUpdateSign(CPacketUpdateSign packetIn)`
- `void processUseEntity(CPacketUseEntity packetIn)`
- `void processVehicleMove(CPacketVehicleMove packetIn)`
- `void sendPacket(Packet<?> packetIn)`
- `void setPlayerLocation(double x, double y, double z, float yaw, float pitch)`
- `void setPlayerLocation(double x, double y, double z, float yaw, float pitch, java.util.Set<SPacketPlayerPosLook.EnumFlags> relativeSet)`
- `void update()`

## Fields

- `NetworkManager netManager`
- `EntityPlayerMP player`