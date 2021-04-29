package app.twomes.warmtewachter;

import android.os.Bundle;

import com.dutchconcepts.capacitor.barcodescanner.BarcodeScanner;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;
import com.myapp.plugins.espprovisioning.EspProvisioning;

import java.util.ArrayList;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    // Initializes the Bridge
    this.init(savedInstanceState, new ArrayList<Class<? extends Plugin>>() {{
      // Additional plugins you've installed go here
      // Ex: add(TotallyAwesomePlugin.class);
      add(BarcodeScanner.class);
      add(EspProvisioning.class);
    }});
  }


}
