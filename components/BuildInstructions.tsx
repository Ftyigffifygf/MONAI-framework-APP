
import React from 'react';

const instructions = [
  {
    title: "Set Up Project Directory",
    description: "Create the folder structure as shown in Section 1. Place your pre-trained `brain_tumor_model.pth` inside the `models/` sub-directory."
  },
  {
    title: "Create Core Files",
    description: "Create the `run_segmenter.py` and `requirements.txt` files in your project's root directory. Copy the code from Sections 2 and 3 into them."
  },
  {
    title: "Create a Virtual Environment",
    description: "It's best practice to isolate your project's dependencies. Open a terminal in your project directory and run:",
    code: "python -m venv venv\nsource venv/bin/activate  # On macOS/Linux\n.\\venv\\Scripts\\activate  # On Windows"
  },
  {
    title: "Install Dependencies",
    description: "Install all the required libraries from your `requirements.txt` file using pip:",
    code: "pip install -r requirements.txt"
  },
  {
    title: "Run the PyInstaller Build Command",
    description: "Execute the build command from Section 4 in your terminal. This process may take a few minutes as it collects all dependencies and packages them.",
    code: `pyinstaller --name BrainSegmenter --onefile --console --add-data "models/brain_tumor_model.pth:models" run_segmenter.py`
  },
  {
    title: "Locate Your Executable",
    description: "PyInstaller will create a `dist/` folder in your project directory. Inside, you will find your standalone executable: `BrainSegmenter` (or `BrainSegmenter.exe` on Windows)."
  }
];

export const BuildInstructions: React.FC = () => {
  return (
    <ol className="relative border-l border-gray-700">
      {instructions.map((item, index) => (
        <li key={index} className="mb-10 ml-6">
          <span className="absolute flex items-center justify-center w-8 h-8 bg-cyan-900 rounded-full -left-4 ring-8 ring-gray-900 text-cyan-300">
            {index + 1}
          </span>
          <h3 className="flex items-center mb-1 text-lg font-semibold text-white">{item.title}</h3>
          <p className="block mb-2 text-sm font-normal leading-none text-gray-400">{item.description}</p>
          {item.code && (
            <pre className="bg-gray-900 rounded-md p-3 mt-2 text-xs font-mono text-gray-300 overflow-x-auto">
              <code>{item.code}</code>
            </pre>
          )}
        </li>
      ))}
    </ol>
  );
};
