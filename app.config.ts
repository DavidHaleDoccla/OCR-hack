import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  slug: "my-app",
  name: "My App",
  plugins: [
    [
      "expo-image-picker",
      {
        cameraPermission:
          "The app accesses your photos to let you share them with your friends.",
      },
    ],
  ],
});
