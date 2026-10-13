package com.mumfrey.webprefs.framework;

import com.mumfrey.webprefs.interfaces.IWebPreferencesClient;
import com.mumfrey.webprefs.interfaces.IWebPreferencesProvider;
import com.mumfrey.webprefs.interfaces.IWebPreferencesRequest;
import com.mumfrey.webprefs.interfaces.IWebPreferencesResponse;

class WebPreferencesServiceTaskSet extends WebPreferencesServiceTask
{
    WebPreferencesServiceTaskSet(IWebPreferencesProvider provider, IWebPreferencesClient client)
    {
        super(provider, client);
    }

    @Override
    public void onReceivedResponse(IWebPreferencesRequest request, IWebPreferencesResponse response)
    {
        IWebPreferencesClient client = this.getClient();
        if (client != null && response.hasSetters())
        {
            client.onSetRequestSuccess(response.getUUID(), response.getSetters());
        }
    }

    @Override
    public void onRequestFailed(IWebPreferencesRequest request, Throwable th, RequestFailureReason reason)
    {
        IWebPreferencesClient client = this.getClient();
        if (client != null)
        {
            client.onSetRequestFailed(request.getUUID(), request.getKeys(), reason);
        }
    }
}
