import { useStore } from "@nanostores/react";
import $lang, { Langs } from "../stores/lang";
import { useEffect, useState } from "react";

export default function InlineLang({ html, react }) {
  const currentLang = useStore($lang)
  const [renderLang, setRenderLang] = useState(Langs.HTML)

  // we do this in a useEffect to avoid hydration errors
  useEffect(() => {
    setRenderLang(currentLang)
  }, [currentLang])

  return <code>{renderLang === Langs.HTML ? html : react}</code>
}