import { useStore } from "@nanostores/react";
import $lang, { Langs } from "../stores/lang";

export default function InlineLang({ html, react }) {
  // TODO hydration problems with store
  const currentLang = useStore($lang)
  return <code>{currentLang === Langs.HTML ? html : react}</code>
}