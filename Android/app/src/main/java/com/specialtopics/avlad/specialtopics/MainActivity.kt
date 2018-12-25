package com.specialtopics.avlad.specialtopics

import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.widget.TextView
import android.widget.ToggleButton
import com.github.nkzawa.emitter.Emitter
import com.github.nkzawa.socketio.client.IO;
import com.github.nkzawa.socketio.client.Socket;
import org.json.JSONObject
import java.util.*

class MainActivity : AppCompatActivity() {

    var tglBtn: ToggleButton? = null
    var tvIntensity: TextView? = null

    val socket: Socket by lazy {
        return@lazy IO.socket("http://192.168.1.129:8080")
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        tglBtn = findViewById(R.id.tglBtn);
        tvIntensity = findViewById(R.id.tvIntensiy)
        tglBtn?.setOnCheckedChangeListener { compoundButton, state ->
            socket.emit("light", "{\"state\":" + state + "}")
        }
        socket
                .on("connect", {
                    Log.d("SocketIO", "Connected");
                })

        socket.on("sensorData", Emitter.Listener {
            Log.d("SocketIO", "New Data");
            runOnUiThread {
                tvIntensity?.setText(""+((it.get(0) as JSONObject).getInt("value")))
            }
        })
        socket.connect()

    }


}
