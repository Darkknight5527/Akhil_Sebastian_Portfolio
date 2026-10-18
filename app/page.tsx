import top from "@/components/legacy/top";
import nav from "@/components/legacy/nav";
import hero from "@/components/legacy/hero";
import about from "@/components/legacy/about";
import projects from "@/components/legacy/projects";
import experience from "@/components/legacy/experience";
import skills from "@/components/legacy/skills";
import contact from "@/components/legacy/contact";
import overlays from "@/components/legacy/overlays";
import { LegacyScripts } from "@/components/LegacyScripts";

/**
 * A faithful copy of the original single-file site.
 * Each part below is the original markup for one section; to upgrade a section,
 * replace its <Part> with a React component. Everything else stays as it was.
 */
const PARTS = { top, nav, hero, about, projects, experience, skills, contact, overlays };

function Part({ html }: { html: string }) {
  return <div style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: html }} />;
}

export default function Home() {
  return (
    <>
      <Part html={PARTS.top} />
      <Part html={PARTS.nav} />
      <Part html={PARTS.hero} />
      <Part html={PARTS.about} />
      <Part html={PARTS.projects} />
      <Part html={PARTS.experience} />
      <Part html={PARTS.skills} />
      <Part html={PARTS.contact} />
      <Part html={PARTS.overlays} />
      <LegacyScripts />
    </>
  );
}
