# ServerChatEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.ServerChatEvent

## Class signature

```java
public class ServerChatEvent extends Event
```

## Constructors

- `ServerChatEvent(EntityPlayerMP player, java.lang.String message, ITextComponent component)`

## Methods

- `ITextComponent getComponent()`
- `java.lang.String getMessage()`
- `EntityPlayerMP getPlayer()`
- `java.lang.String getUsername()`
- `void setComponent(ITextComponent e)`