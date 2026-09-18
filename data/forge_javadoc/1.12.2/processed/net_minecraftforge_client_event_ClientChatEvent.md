# ClientChatEvent

## Class signature

```java
public class ClientChatEvent extends Event
```

## Constructors

- `public ClientChatEvent(java.lang.String message)`

## Methods

- `public java.lang.String getMessage()`
- `public void setMessage(java.lang.String message)`
- `public java.lang.String getOriginalMessage()`

## Description

ClientChatEvent is fired whenever the client is about to send a chat message or command to the server. This event is fired via ForgeEventFactory.onClientSendMessage(String) , which is executed by GuiS