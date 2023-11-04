/** @jsxImportSource react */
import React, { useState } from "react";
import clsx from "clsx";
import { tagline } from "./config/style-vars";
import FooterContent from "./components/footer-content";
import Cta from "./components/cta";
import PlayerPanel from "./components/player-panel";
import Hero from "./components/hero";
import Description from "./components/description";
import type { MediaChromeListItem } from "../../types";
import SourcePanel from "./components/source-panel";
import Toggle from "./components/toggle";
import ComponentsList from "./components/components-list";
import mediaChromeListItems from "./shared/data";

const Home = () => {
  const items = mediaChromeListItems;

  const [selectedItem, setSelectedItem] = useState<
    MediaChromeListItem | undefined
  >(undefined);

  const [showingSource, setShowingSource] = useState(false);

  const ActivePanel = showingSource ? SourcePanel : PlayerPanel;

  return (
    <div className="lg:flex w-screen h-screen">
      <header className="lg:hidden">
        <div className="p-8 sticky top-0 bg-white">{`<media-chrome>`}</div>
        <div className="px-8 pb-8">
          <Hero tagline={tagline} />
        </div>
      </header>
      <div className="sticky top-0 flex flex-col w-screen lg:order-1 lg:w-13/20 lg:h-full">
        <main className="bg-white lg:flex-grow lg:px-12 lg:pt-12">
          <div className="lg:h-full lg:flex lg:flex-col">
            <ActivePanel selectedItem={selectedItem} tabIndex={2} />
            <div
              className={clsx("mt-auto h-12 lg:flex items-center", {
                "border-t border-solid border-black": showingSource,
                hidden: !showingSource,
                flex: showingSource,
              })}
            >
              <div>
                <Toggle
                  id="viewSource"
                  label="View Source"
                  onSelectionChange={setShowingSource}
                />
              </div>
            </div>
          </div>
        </main>
        <footer className="sr-only lg:not-sr-only">
          <div className="bg-secondary-225 flex flex-col justify-center p-8 lg:p-12 border-t border-solid border-black">
            <Description selectedItem={selectedItem} />
          </div>
          <div className="hidden lg:block p-8 lg:p-12 bg-black text-white">
            <FooterContent />
          </div>
        </footer>
      </div>
      <nav className="flex flex-col bg-primary-50 p-8 lg:p-12 lg:border-r lg:border-solid lg:border-black">
        <div className="hidden lg:block pb-8">
          <Hero tagline={tagline} />
        </div>
        <ComponentsList
          tabIndex={1}
          items={items}
          selectedItem={selectedItem}
          onItemSelected={setSelectedItem}
          onItemDeselected={(value) => {
            if (value !== selectedItem) return;
            setSelectedItem(undefined);
          }}
        />
        <div className="hidden lg:block pt-12 lg:bg-primary-50 lg:text-black">
          <Cta />
        </div>
      </nav>
      <footer className="lg:hidden">
        <div className="p-8 lg:p-12 bg-black text-white lg:hidden">
          <Cta />
        </div>
        <div className="p-8 lg:p-12 bg-black text-white">
          <FooterContent />
        </div>
      </footer>
    </div>
  );
};

export default Home;
