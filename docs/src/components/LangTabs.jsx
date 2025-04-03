/** @jsxImportSource react */
import * as Tabs from '@radix-ui/react-tabs'
import { useStore } from '@nanostores/react'
import { useEffect } from 'react'
import $lang, { Langs } from '../stores/lang'

export default function LangTabs(props) {
  const showHTML = props.html?.props?.value
  const showReact = props.react?.props?.value
  const currentLang = useStore($lang)

  // Load saved preference on mount
  useEffect(() => {
    const savedLang = localStorage.getItem('preferred-lang')
    if (savedLang === Langs.HTML || savedLang === Langs.React) {
      $lang.set(savedLang)
    }
  }, [])

  // Save to localStorage when value changes
  useEffect(() => {
    localStorage.setItem('preferred-lang', currentLang)
  }, [currentLang])

  return (
    <Tabs.Root value={currentLang} onValueChange={$lang.set} className="tab-root">
    <Tabs.List>
      {showHTML ? <Tabs.Trigger value={Langs.HTML}>HTML</Tabs.Trigger> : null}
      {showReact ? <Tabs.Trigger value={Langs.React}>React</Tabs.Trigger> : null}
    </Tabs.List>
      {showHTML ? (
        <Tabs.Content value={Langs.HTML}>
          {props.html}
        </Tabs.Content>
      ) : null}
      {showReact ? (
        <Tabs.Content value={Langs.React}>
          {props.react}
        </Tabs.Content>
      ) : null}
    </Tabs.Root>
  );
}