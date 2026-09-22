# ClientChatReceivedEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.client.event.ClientChatReceivedEvent

## Class signature

```java
public class ClientChatReceivedEvent extends Event
```

## Constructors

- `ClientChatReceivedEvent(byte type, ITextComponent message)`

## Methods

- `ITextComponent getMessage()`
- `byte getType()` — Introduced in 1.8: 0 : Standard Text Message 1 : 'System' message, displayed as standard text. 2 : 'Status' message, displayed above action bar, where song notifications are.
- `void setMessage(ITextComponent message)`