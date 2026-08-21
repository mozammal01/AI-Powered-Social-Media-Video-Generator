import "./index.css";
import { Composition } from "remotion";
import { HelloWorld, myCompSchema } from "./HelloWorld";
import { Logo, myCompSchema2 } from "./HelloWorld/Logo";
import { MolecularArtComposition } from "./molecular-simulation/MolecularArtComposition";
import { ProductAdvertisement } from "./remotion/compositions/ProductAdvertisement";
import { productAdvertisementSchema } from "./remotion/compositions/schema";
import {
  demoVideoContent,
  PRODUCT_AD_DURATION,
  PRODUCT_AD_FPS,
} from "./data/defaults";
import { ASPECT_RATIO_DIMENSIONS } from "./types";

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  const { width, height } = ASPECT_RATIO_DIMENSIONS["9:16"];

  return (
    <>
      <Composition
        id="ProductAdvertisement"
        component={ProductAdvertisement}
        durationInFrames={PRODUCT_AD_DURATION}
        fps={PRODUCT_AD_FPS}
        width={width}
        height={height}
        schema={productAdvertisementSchema}
        defaultProps={demoVideoContent}
      />

      <Composition
        id="MolecularArt"
        component={MolecularArtComposition}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        // You can take the "id" to render a video:
        // npx remotion render HelloWorld
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        // You can override these props for each render:
        // https://www.remotion.dev/docs/parametrized-rendering
        schema={myCompSchema}
        defaultProps={{
          titleText: "Welcome to Remotion",
          titleColor: "#000000",
          logoColor1: "#009fca",
          logoColor2: "#00a6de",
        }}
      />

      {/* Mount any React component to make it show up in the sidebar and work on it individually! */}
      <Composition
        id="OnlyLogo"
        component={Logo}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        schema={myCompSchema2}
        defaultProps={{
          logoColor1: "#91dAE2" as const,
          logoColor2: "#86A8E7" as const,
        }}
      />
    </>
  );
};
