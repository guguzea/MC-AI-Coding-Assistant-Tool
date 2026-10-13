package com.mumfrey.webprefs.interfaces;

public interface IWebPreferencesService
{
    public abstract void addMonitor(IWebPreferencesServiceMonitor monitor);

    public abstract void submit(IWebPreferencesRequest request);
}
