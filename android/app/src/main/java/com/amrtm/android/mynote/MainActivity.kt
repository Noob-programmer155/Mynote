package com.amrtm.android.mynote

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.webkit.WebResourceRequest
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity

class MainActivity: AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val view = WebView(this)
        view.loadUrl("http://localhost:8080")
        view.settings.domStorageEnabled = true
        view.settings.javaScriptEnabled = true
        view.webViewClient = Client(this)

        setContentView(view)
    }
}

private class Client (val activity:Activity): WebViewClient() {
    override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
        if (request?.url?.host == "localhost") return false

        val intent:Intent = Intent(Intent.ACTION_VIEW,request?.url)
        activity.startActivity(intent)
        return true
    }

}