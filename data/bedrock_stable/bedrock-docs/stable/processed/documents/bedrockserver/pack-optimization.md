> 来源：https://learn.microsoft.com/en-us/minecraft/creator/documents/bedrockserver/pack-optimization?view=minecraft-bedrock-stable
> 抓取时间：2026-09-21T11:50:34.317Z
> 警告：此文档可能滞后于当前正式版

# Pack Optimization Using Dedicated Server

## What is Pack Optimization?

Pack Optimization packages the loose files in your resource and behavior packs into archives so that players can get into Minecraft faster.

The Minecraft Dedicated Server can be configured to run pack optimization and will minify JSON files by stripping whitespace and package loose files into an archive.

Use pack optimization if you are testing large addons or hosting worlds that use custom packs for your friends.

You can run the server in a pack-optimization mode by passing `PackOptimizerConfigPath= ` when starting a Bedrock Dedicated Server using `bedrock.exe`.

## Version Compatibility

Packs that have been optimized using this process will have a minimum client version of 1.26.40 .

Older clients will not be able to read this data correctly and will fail to load.

Optimized packs are forward compatible with future releases of Minecraft and will continue to work with newer client versions.

## Command Line Usage

Run `bedrock_server.exe` with the `PackOptimizerConfigPath` argument:

```powershell
./bedrock_server.exe PackOptimizerConfigPath=D:/path/to/pack_optimizer_config.json
```

If the path contains spaces, quote the full key/value argument:

```powershell
./bedrock_server.exe "PackOptimizerConfigPath=D:/path with spaces/pack_optimizer_config.json"
```

When this argument is present on Windows builds, the server:

- Reads the config file.

- Optimizes packs found in the configured input directory.

- Writes optimized output packs to the configured output directory.

- Exits after processing.

The server does not continue into normal dedicated server runtime.

## Config File Format

Create the `pack_optimizer_config.json` config file with:

```json
{
 "input_directory": "D:/path/to/packs",
 "output_directory": "D:/path/to/output",
 "verbose_logging": false
}
```

### Fields

- input_directory (required): Directory containing packs to process.

- output_directory (required): Directory where optimized packs are written.

- verbose_logging (optional, default false ): Enables detailed logs.

### Directory Behavior

- Each subdirectory in input_directory is treated as one pack.

- Output is written to output_directory .

- Optimized packs include __brarchive/ output produced by the bake pipeline.

### Exit Behavior and Errors

- Server startup stops after optimization work completes.

- If optimization fails, the process returns dedicated server exit code 7 ( ResourceProcessingError ).

- If input_directory does not exist, processing fails early with an invalid-argument error.

## Example Pack Optimization

This example will use sample pack names from the `minecraft-samples` repository .

- Prepare the packs to optimize:

```text
D:/AddOns/packs_input/
 resource_pack_sample/
 behavior_pack_sample/
```

If you are optimizing a Marketplace structured pack, the folders above will be the `Content\resource_packs` and `Content\behavior_packs` folders. Output folders are generated as needed; you do not need to create output directories.

- Create config file D:/work/pack_optimizer_config.json :

```json
{
 "input_directory": "D:/work/packs_input",
 "output_directory": "D:/work/packs_output",
 "verbose_logging": false
}
```

- Run pack optimization:

```powershell
./bedrock_server.exe PackOptimizerConfigPath=D:/work/pack_optimizer_config.json
```

- Check optimized output in D:/work/packs_output .

## Feedback

 Was this page helpful?

 Yes

 No

 No

 Need help with this topic?

 Want to try using Ask Learn to clarify or guide you through this topic?

 Suggest a fix?
