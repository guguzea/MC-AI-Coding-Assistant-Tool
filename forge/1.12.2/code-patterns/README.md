# Forge 1.12.2 代码模式库

> 本目录收集 Forge 1.12.2 模组开发中的常用代码片段与模式参考。

## 目录

| 文件 | 内容 |
|------|------|
| `registry-pattern.md` | 注册模式（方块/物品/TileEntity/实体） |
| `block-pattern.md` | 方块与 TileEntity 完整示例 |
| `item-pattern.md` | 物品、工具、盔甲完整示例 |
| `networking-pattern.md` | 网络通信完整示例 |
| `proxy-pattern.md` | 代理模式（CommonProxy/ClientProxy） |
| `events-pattern.md` | 事件监听完整示例 |

---

## 通用约定

- 所有 `setRegistryName()` 必须使用 `MOD_ID` 作为 namespace
- `pack_format = 4`（mcmod.info 和 pack.mcmeta）
- `@EventBusSubscriber(modid = MOD_ID)` 注解注册类
- 使用 `@SideOnly(Side.CLIENT)` 标记客户端专用代码
- 资源路径全部小写

## 核心 import

```java
import net.minecraftforge.fml.common.Mod;
import net.minecraftforge.fml.common.Mod.EventHandler;
import net.minecraftforge.fml.common.SidedProxy;
import net.minecraftforge.fml.common.event.FMLInitializationEvent;
import net.minecraftforge.fml.common.event.FMLPreInitializationEvent;
import net.minecraftforge.fml.common.event.FMLPostInitializationEvent;
import net.minecraftforge.fml.common.registry.RegistryEvent;
import net.minecraftforge.fml.common.registry.GameRegistry;
import net.minecraftforge.event.RegistryEvent;
import net.minecraftforge.event.SubscribeEvent;
import net.minecraftforge.fml.relauncher.Side;
import net.minecraftforge.fml.relauncher.SideOnly;
```
