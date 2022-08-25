package com.hexagonsales;

import android.app.Application;
import android.content.Context;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.oblador.vectoricons.VectorIconsPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import java.lang.reflect.InvocationTargetException;
import java.util.List;

//image pipe
import com.facebook.imagepipeline.core.ImagePipelineConfig;
import com.facebook.drawee.backends.pipeline.Fresco;
import static com.facebook.drawee.backends.pipeline.Fresco.getImagePipeline;

//키해쉬
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.Signature;
import android.util.Base64;
import android.util.Log;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
//fcm
///import io.invertase.firebase.RNFirebasePackage;
//import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
//import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;
import com.microsoft.codepush.react.CodePush;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost =
      new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          
          Context context = getApplicationContext();
          ImagePipelineConfig frescoConfig = ImagePipelineConfig.newBuilder(context)
          .setDownsampleEnabled(false)
          .build();

          List<ReactPackage> packages = new PackageList(this).getPackages();

          //packages.add(new RNFirebaseMessagingPackage());
          //packages.add(new RNFirebaseNotificationsPackage());
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // packages.add(new MyReactNativePackage());
          return packages;
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }
        @Override
        protected String getJSBundleFile() {
            return CodePush.getJSBundleFile();
        }
      };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();

    ImagePipelineConfig pipelineConfig = ImagePipelineConfig.newBuilder(this)
                .setResizeAndRotateEnabledForNetwork(false)
                .build();
    Fresco.initialize(this, pipelineConfig);

    SoLoader.init(this, /* native exopackage */ false);
    initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
    try {
      PackageInfo info = getPackageManager().getPackageInfo(
              "com.hexagonsales",
              PackageManager.GET_SIGNATURES);
          for (Signature signature : info.signatures) {
              MessageDigest md = MessageDigest.getInstance("SHA");
              md.update(signature.toByteArray());
              Log.d("KeyHash:", Base64.encodeToString(md.digest(), Base64.DEFAULT));
          }
    } catch (PackageManager.NameNotFoundException e) {

    } catch (NoSuchAlgorithmException e) {
    }
  }

  /**
   * Loads Flipper in React Native templates. Call this in the onCreate method with something like
   * initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
   *
   * @param context
   * @param reactInstanceManager
   */
  private static void initializeFlipper(
      Context context, ReactInstanceManager reactInstanceManager) {
    if (BuildConfig.DEBUG) {
      try {
        /*
         We use reflection here to pick up the class that initializes Flipper,
        since Flipper library is not available in release mode
        */
        Class<?> aClass = Class.forName("com.hexagonsales.ReactNativeFlipper");
        aClass
            .getMethod("initializeFlipper", Context.class, ReactInstanceManager.class)
            .invoke(null, context, reactInstanceManager);
      } catch (ClassNotFoundException e) {
        e.printStackTrace();
      } catch (NoSuchMethodException e) {
        e.printStackTrace();
      } catch (IllegalAccessException e) {
        e.printStackTrace();
      } catch (InvocationTargetException e) {
        e.printStackTrace();
      }
    }
  }
}
