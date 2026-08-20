# Interfaces

> 来源：https://www.liteloader.com/explore/docs/dev:interfaces
> 版本：1.12.2
> 页面 ID：dev:interfaces
> 抓取源：liteloader-wiki
> 警告：LiteLoader 官方 DokuWiki 是未按 MC 版本切分的现行站（开发停在 1.12.2）。本页挂在该 version 索引下仅供 search_docs 检索，禁止当成该版本专属官方树。API 以本档 verified-api 核实表为准。

# Interfaces
All LiteLoader mods must implement one or more of the LiteMod interfaces in order to be loaded, in general you should add interfaces to your mod class based on the events you want to hook, and should remove any interfaces you are not using, this helps the Loader optimise the callback lists to only include mods which need to receive a particular event callback.

The best way to learn about each interface is to [read the source code](https://www.assembla.com/code/liteloader/subversion/nodes/) but a quick summary is provided below

### Shared Interfaces
These interfaces can be used on both client and server:

* [.:interfaces:LiteMod](.:interfaces:LiteMod): the base mod interface, implement this if you just want to be loaded and manage the rest of your lifecycle yourself, all the other interfaces derive from this so if you are implementing any sub interface there's no need to implement this directly

* [.:interfaces:Permissible](.:interfaces:Permissible): Allows your mod to leverage the [ClientPermissions API](permissions), this is an advanced topic and I really need to write a whole tutorial just for this.

* [.:interfaces:Configurable](.:interfaces:Configurable):  Allows your mod to provide a ConfigPanel which will be accessible via the Mod Info screen

* [.:interfaces:PluginChannelListener](.:interfaces:PluginChannelListener): provides callbacks to allow your mod to register and use plugin channels.

* [.:interfaces:PreJoinGameListener](.:interfaces:PreJoinGameListener): Provides a callback immediately prior to login (connecting to single player or server).

* [.:interfaces:PacketHandler](.:interfaces:PacketHandler): Allows your mod to handle raw packets

* [.:interfaces:ServerPlayerListener](.:interfaces:ServerPlayerListener): Provides callbacks on the server/in singleplayer when players connect, join and leave the game, and respawn.

* [.:interfaces:ServerCommandProvider](.:interfaces:ServerCommandProvider): Allows a mod to provide commands to the running server instance (including single player).

* [.:interfaces:ServerChatFilter](.:interfaces:ServerChatFilter): Allows a mod to receive, filter and modify chat messages arriving from clients.

### Client Interfaces
These interfaces can only be used at the client:

* [.:interfaces:Tickable](.:interfaces:Tickable): provides a callback every frame at the end of the game loop

* [.:interfaces:GameLoopListener](.:interfaces:GameLoopListener): Like tickable but called at the start of the game loop.

* [.:interfaces:InitCompleteListener](.:interfaces:InitCompleteListener): LiteMods get an init() call very early in the game startup process, which can be useful. However sometimes you need to do some initialisation after the game is fully initialised, this interface provides a late initialisation callback that can be used to initialise parts of your mod which need access to the game.

* [.:interfaces:RenderListener](.:interfaces:RenderListener): provides callbacks at different points in the render loop

* [.:interfaces:PostRenderListener](.:interfaces:PostRenderListener): provides additional callbacks at the end of the render loop.

* [.:interfaces:EntityRenderListener](.:interfaces:EntityRenderListener): provides callbacks before and after entities are rendered

* [.:interfaces:HUDRenderListener](.:interfaces:HUDRenderListener): provides callbacks before and after the minecraft HUD is rendered.

* [.:interfaces:ChatRenderListener](.:interfaces:ChatRenderListener): provides callbacks before and after the in-game chat is rendered.

* [.:interfaces:ChatListener](.:interfaces:ChatListener): allows your mod to monitor incoming chat.

* [.:interfaces:ChatFilter](.:interfaces:ChatFilter): allows your mod to monitor, filter and modify incoming chat.
 
**This interface must not be used together with [.:interfaces:ChatListener](.:interfaces:ChatListener)**.

* [.:interfaces:OutboundChatListener](.:interfaces:OutboundChatListener): allows your mod to monitor chat messages sent by the player.

* [.:interfaces:OutboundChatFilter](.:interfaces:OutboundChatFilter): allows your mod to monitor, filter and modify chat messages sent by the player.

* [.:interfaces:FrameBufferListener](.:interfaces:FrameBufferListener): Provides callbacks to your mod when Minecraft' main FBO is rendered to the screen

* [.:interfaces:ScreenshotListener](.:interfaces:ScreenshotListener): Provides a callback when a screenshot is taken

* [.:interfaces:JoinGameListener](.:interfaces:JoinGameListener): Provides a callback when the client successfully joins a game (whether single or multiplayer).

* [.:interfaces:PostLoginListener](.:interfaces:PostLoginListener): Provides a callback on login (when a successful login response is received from the server).
