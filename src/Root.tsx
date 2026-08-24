import "./index.css";
import { Composition } from "remotion";
import { HelloWorld, myCompSchema } from "./HelloWorld";
import { Logo, myCompSchema2 } from "./HelloWorld/Logo";
import { MolecularArtComposition } from "./molecular-simulation/MolecularArtComposition";
import { videoContentSchema } from "./remotion/schema";
import { getTemplateDimensions, templateList } from "./remotion/templates";
import { getTemplateComponent } from "./remotion/templates/components";
import { Top10Listicle } from "./remotion/templates/Top10Listicle/Top10Listicle";
import { TechExplainer } from "./remotion/templates/TechExplainer/TechExplainer";

const sampleListicleData = [
  { rank: 10, title: "Astonishing Facts", imageSrc: "https://images.unsplash.com/photo-1502481851512-e9e2529bfbf9?auto=format&fit=crop&w=1080&q=80" },
  { rank: 9, title: "Hidden Secrets", imageSrc: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1080&q=80" },
  { rank: 8, title: "Mind Blowing", imageSrc: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1080&q=80" },
  { rank: 7, title: "Unbelievable Truths", imageSrc: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1080&q=80" },
  { rank: 6, title: "Rare Discoveries", imageSrc: "https://images.unsplash.com/photo-1506744626753-1fa304e1f74f?auto=format&fit=crop&w=1080&q=80" },
  { rank: 5, title: "Lost Treasures", imageSrc: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1080&q=80" },
  { rank: 4, title: "Ancient Mysteries", imageSrc: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1080&q=80" },
  { rank: 3, title: "Bizarre Events", imageSrc: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=1080&q=80" },
  { rank: 2, title: "Epic Journeys", imageSrc: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=1080&q=80" },
  { rank: 1, title: "The Ultimate Secret", imageSrc: "https://images.unsplash.com/photo-1500964757637-c85e8a162699?auto=format&fit=crop&w=1080&q=80" },
];

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* ── Video templates (registered in remotion/templates/registry.ts) ── */}
      {templateList.map((template) => {
        const { width, height } = getTemplateDimensions(
          template,
          template.defaultAspectRatio
        );

        return (
          <Composition
            key={template.id}
            id={template.id}
            component={getTemplateComponent(template.id)}
            durationInFrames={template.durationInFrames}
            fps={template.fps}
            width={width}
            height={height}
            schema={videoContentSchema}
            defaultProps={template.defaultProps}
          />
        );
      })}

      {/* ── Standalone demo compositions ── */}
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
        // npx remotion render HelloWorld out/video.mp4
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

      <Composition
        id="Top10Listicle"
        component={Top10Listicle}
        durationInFrames={900} // 10 items * 90 frames = 900
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          items: sampleListicleData,
          itemDurationInFrames: 90
        }}
      />

      <Composition
        id="TechExplainer"
        component={TechExplainer}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};