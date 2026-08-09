# ForgeConfigSpec 最小配置

- **平台**：Forge 1.20.1
- **Skill**：`mc-config`
- **MCP**：`generate_config`、`search_forge_docs`

```java
public class ModConfig {
    public static final ForgeConfigSpec SPEC;
    public static final ForgeConfigSpec.IntValue MAX_SIZE;
    static {
        ForgeConfigSpec.Builder b = new ForgeConfigSpec.Builder();
        MAX_SIZE = b.defineInRange("maxSize", 64, 1, 256);
        SPEC = b.build();
    }
}
// ModLoadingContext.get().registerConfig(ModConfig.Type.COMMON, ModConfig.SPEC);
```

## 坑

- 区分 CLIENT / COMMON / SERVER
- Fabric 常用 Cloth Config（见 `authored/lib-cloth-config`）
