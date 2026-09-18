# ServerChatEvent

## Class signature

```java
public class ServerChatEvent extends Event
```

## Constructors

- `public ServerChatEvent( EntityPlayerMP player, java.lang.String message, ChatComponentTranslation component)`

## Methods

- `public void setComponent( IChatComponent e)`
- `public IChatComponent getComponent()`

## Description

ServerChatEvent is fired whenever a C01PacketChatMessage is processed. This event is fired via ForgeHooks#onServerChatEvent(net.minecraft.network.NetHandlerPlayServer, String, ChatComponentTranslation