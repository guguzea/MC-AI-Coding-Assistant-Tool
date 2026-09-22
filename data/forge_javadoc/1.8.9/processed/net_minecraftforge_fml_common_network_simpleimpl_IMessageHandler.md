# IMessageHandler

## Class signature

```java
public interface IMessageHandler<REQ extends IMessage, REPLY extends IMessage>
```

## Methods

- `REPLY onMessage(REQ message, MessageContext ctx)` — Called when a message is received of the appropriate type.