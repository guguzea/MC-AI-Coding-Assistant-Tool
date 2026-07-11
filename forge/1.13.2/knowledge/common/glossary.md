# 术语表（Forge 1.13.2）

## 核心概念

### RegistryEvent.Register
: Forge 1.13.2 的注册方式。通过 `@SubscribeEvent` 在对应类型的 Registry 事件时注册内容。

### @SubscribeEvent
: 事件订阅注解。标注方法在特定事件触发时执行。

### setRegistryName
: 设置注册名称的方法。必须在注册时调用以确保内容可被游戏识别。

### Mixin
: SpongePowered Mixin 框架，通过字节码注入修改 Minecraft / Forge 类的行为。

### Capability
: Forge 的跨对象数据共享机制。通过 `IItemHandler`、`IFluidHandler` 等接口附加到 Entity / TileEntity / ItemStack。

### DataGen
: 数据生成器。手动编写 JSON 文件生成配方、战利品表、模型等。

### pack_format
: 数据包 / 资源包的版本标识。1.13.2 使用 `6`。

---

## 注册表

### ForgeRegistries
: Forge 所有内置注册表的静态持有类。通过 `ForgeRegistries.BLOCKS`、`ForgeRegistries.ITEMS` 等字段访问。

---

## 构建系统

### ForgeGradle
: Forge 官方的 Gradle 插件，处理 Minecraft 反编译、映射、应用补丁等。

### MCP
: Minecraft Coder Pack。Forge 1.13.2 使用的映射格式（SRG）。

### reobfJar
: ForgeGradle 任务，在打包前将混淆的类名重新映射为原始映射名。

---

## 事件系统

### FMLCommonSetupEvent
: 所有 mod 构造函数执行完毕后的初始化事件，用于跨 mod 交互。

### FMLClientSetupEvent
: 客户端专用初始化，在客户端物理端启动时触发。

### AttachCapabilitiesEvent
: 在实体 / TileEntity 上附加 Capability Provider 的事件。

### RegistryEvent.Register<T>
: 每个注册表触发一次的通知事件。

---

## 网络

### SimpleNetworkWrapper
: Forge 1.13.2 的网络通道封装类。

### IMessage
: 网络消息接口。包含 `toBytes`/`fromBytes` 方法用于序列化。

### PacketBuffer
: 1.13.2 的字节缓冲区类，用于网络消息序列化。

---

## GUI

### Container
: 1.13.2 的容器接口。用于管理槽位和物品转移。

### IGuiHandler
: GUI 处理器接口。创建服务端 Container 和客户端 GuiScreen。

### GuiScreen
: 1.13.2 的 GUI 屏幕基类。

---

## 资源文件

### ResourceLocation
: Minecraft 的资源标识符，格式为 `namespace:path`，如 `minecraft:stone`。

### pack.mcmeta
: 数据包 / 资源包的元数据文件，包含 `pack_format` 和 `description` 字段。

### NBTTagCompound
: 1.13.2 的 NBT 化合物标签类（1.14+ 改名为 CompoundTag）。
