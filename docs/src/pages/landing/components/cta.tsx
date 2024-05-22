/** @jsxImportSource react */
import UpRightArrow from './icons/up-right-arrow';

const Cta = () => {
  return (
    <div>
      <h3 className="text-4xl flex flex-wrap">
        <span className="whitespace-pre-wrap"> </span>
        <a href="/docs/en/get-started" className="flex items-center">
          <span className="border-current border-b">Docs</span>
          <UpRightArrow className="ml-2" />
        </a>
      </h3>
      <br />
      <h3 className="text-4xl flex flex-wrap">
        <span className="whitespace-pre-wrap"> </span>
        <a
          href="https://github.com/muxinc/media-chrome"
          className="flex items-center"
        >
          <span className="border-current border-b">Github</span>
          <UpRightArrow className="ml-2" />
        </a>
      </h3>
    </div>
  );
};

export default Cta;
