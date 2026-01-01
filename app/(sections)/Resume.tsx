import { BsFiletypePdf } from "react-icons/bs";
import { IoMdOpen } from "react-icons/io";

export default function Resume() {
  return (
    <div className="m-x-auto flex flex-row justify-center gap-8">
      <div className="border border-gray-300 rounded-lg p-1 max-w-md">
        <a
          href="/resume.pdf"
          className="flex items-center gap-4 p-4 w-fit hover:text-blue-600"
          download
        >
          <BsFiletypePdf size={24} style={{ verticalAlign: "middle" }} />
          <p className="font-mono text-lg flex flex-row items-center gap-2">
            Download
          </p>
        </a>
      </div>
      <div className="border border-gray-300 rounded-lg p-1 max-w-md">
        <a
          href="/resume.pdf"
          className="flex items-center gap-2 p-4 w-fit hover:text-blue-600"
          target="_blank"
          rel="noreferrer"
        >
          <IoMdOpen size={24} style={{ verticalAlign: "middle" }} />
          <p className="font-mono text-lg">Open</p>
        </a>
      </div>
    </div>
  );
}
