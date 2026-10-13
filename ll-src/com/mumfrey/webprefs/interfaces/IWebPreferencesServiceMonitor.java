package com.mumfrey.webprefs.interfaces;

public interface IWebPreferencesServiceMonitor
{
    public abstract void onKeyRequestFailed();

    public abstract void onRequestFailed(Throwable th, int severity);
}
