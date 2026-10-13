/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.crashreport;

import java.util.List;

import net.minecraft.crash.CrashReport;
import net.minecraft.launchwrapper.IClassTransformer;
import net.minecraft.launchwrapper.Launch;

public class CrashSectionLaunchWrapper
{
    final CrashReport crashReport;

    public CrashSectionLaunchWrapper(CrashReport report)
    {
        this.crashReport = report;
    }

    /* (non-Javadoc)
     * @see java.lang.Object#toString()
     */
    @Override
    public String toString()
    {
        return CrashSectionLaunchWrapper.generateTransformerList();
    }

    /**
     * Generates a list of active transformers to display in the crash report
     */
    public static String generateTransformerList()
    {
        final List<IClassTransformer> transformers = Launch.classLoader.getTransformers();

        StringBuilder sb = new StringBuilder();
        sb.append(transformers.size());
        sb.append(" active transformer(s)");

        for (IClassTransformer transformer : transformers)
        {
            sb.append("\n          - Transformer: ");
            sb.append(transformer.getClass().getName());
        }

        return sb.toString();
    }
}
