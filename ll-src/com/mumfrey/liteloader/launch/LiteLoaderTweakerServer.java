/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.launch;

import java.io.File;
import java.util.List;

import com.mumfrey.liteloader.util.log.LiteLoaderLogger;
import com.mumfrey.liteloader.util.log.LiteLoaderLogger.Verbosity;

public class LiteLoaderTweakerServer extends LiteLoaderTweaker
{
    private static final String SERVER_API = "com.mumfrey.liteloader.server.api.LiteLoaderCoreAPIServer";

    public LiteLoaderTweakerServer()
    {
        LiteLoaderLogger.setVerbosity(Verbosity.REDUCED);
    }

    @Override
    protected StartupEnvironment spawnStartupEnvironment(List<String> args, File gameDirectory, File assetsDirectory, String profile)
    {
        return new StartupEnvironment(args, gameDirectory, assetsDirectory, profile)
        {
            @Override
            public void registerCoreAPIs(List<String> apisToLoad)
            {
                apisToLoad.add(0, LiteLoaderTweakerServer.SERVER_API);
            }

            @Override
            public int getEnvironmentTypeId()
            {
                return LiteLoaderTweaker.ENV_TYPE_DEDICATEDSERVER;
            }
        };
    }

    @Override
    public String getLaunchTarget()
    {
        super.getLaunchTarget();
        return "net.minecraft.server.MinecraftServer";
    }
}
