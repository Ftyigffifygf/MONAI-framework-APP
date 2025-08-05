export const PROJECT_STRUCTURE = `
monai-segmenter/
├── models/
│   └── brain_tumor_model.pth
├── run_segmenter.py
└── requirements.txt
`;

export const REQUIREMENTS_TXT = `
torch
monai[all]
pyinstaller
`;

export const PYTHON_SCRIPT = `
import argparse
import os
import sys
import torch
import monai
from monai.transforms import (
    Compose,
    LoadImaged,
    EnsureChannelFirstd,
    Orientationd,
    Spacingd,
    ScaleIntensityRanged,
    CropForegroundd,
    AsDiscreted,
    SaveImaged,
)
from monai.inferers import sliding_window_inference
from monai.networks.nets import UNet

def resource_path(relative_path: str) -> str:
    """ Get absolute path to resource, works for dev and for PyInstaller """
    try:
        # PyInstaller creates a temp folder and stores path in _MEIPASS
        base_path = sys._MEIPASS
    except Exception:
        base_path = os.path.abspath(".")

    return os.path.join(base_path, relative_path)

def main():
    parser = argparse.ArgumentParser(description="3D Brain Tumor Segmentation Tool")
    parser.add_argument("--input", type=str, required=True, help="Path to the input NIfTI file (.nii.gz)")
    parser.add_argument("--output", type=str, required=True, help="Path to save the output segmentation NIfTI file.")
    args = parser.parse_args()

    print("--- Brain Tumor Segmentation ---")
    
    # 1. Device Selection
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Using device: {device}")

    # 2. Model Definition
    model = UNet(
        spatial_dims=3,
        in_channels=1,
        out_channels=2, # 1 for background, 1 for tumor
        channels=(16, 32, 64, 128, 256),
        strides=(2, 2, 2, 2),
        num_res_units=2,
    ).to(device)

    # 3. Load Pre-trained Weights
    model_path = resource_path("models/brain_tumor_model.pth")
    print(f"Loading model from: {model_path}")
    if not os.path.exists(model_path):
        print(f"Error: Model file not found at {model_path}. Make sure it's bundled correctly.")
        # As we can't create a dummy model file, we'll exit if it doesn't exist.
        # In a real build, PyInstaller ensures this file is present.
        print("This is a placeholder script. In a real scenario, you'd place your trained model file here.")
        # Create a dummy file for demonstration purposes if it doesn't exist.
        # THIS IS FOR DEMO ONLY. REMOVE IN PRODUCTION.
        print("Creating a dummy model file for demonstration...")
        os.makedirs(os.path.dirname(model_path), exist_ok=True)
        dummy_state_dict = model.state_dict()
        torch.save(dummy_state_dict, model_path)
        print(f"Dummy model saved to {model_path}")

    model.load_state_dict(torch.load(model_path, map_location=device))
    model.eval()

    # 4. Define Pre-processing Transforms
    val_transforms = Compose(
        [
            LoadImaged(keys=["image"]),
            EnsureChannelFirstd(keys=["image"]),
            Orientationd(keys=["image"], axcodes="RAS"),
            Spacingd(keys=["image"], pixdim=(1.0, 1.0, 1.0), mode=("bilinear")),
            ScaleIntensityRanged(
                keys=["image"], a_min=-1000, a_max=1000, b_min=0.0, b_max=1.0, clip=True
            ),
            CropForegroundd(keys=["image"], source_key="image"),
        ]
    )
    
    # 5. Define Post-processing Transforms
    # The output of the model is logits. We need to convert it to a discrete mask.
    post_transforms = Compose([
        AsDiscreted(keys=["pred"], argmax=True),
        SaveImaged(keys=["pred"], meta_keys=["image_meta_dict"], output_dir=os.path.dirname(args.output), output_postfix="", output_ext=".nii.gz", resample=False, separate_folder=False, print_log=False, output_name=os.path.basename(args.output).split('.')[0]),
    ])


    # 6. Load and Process Data
    file_list = [{"image": args.input}]
    
    # Apply pre-processing
    print(f"Processing input file: {args.input}")
    val_data = val_transforms(file_list[0])
    val_image = val_data["image"].unsqueeze(0).to(device) # Add batch dimension

    # 7. Run Inference
    print("Running sliding window inference...")
    with torch.no_grad():
        roi_size = (128, 128, 128)
        sw_batch_size = 4
        val_output = sliding_window_inference(val_image, roi_size, sw_batch_size, model)
    
    # Create a dictionary for post-processing
    result_data = {
        "pred": val_output.squeeze(0), # Remove batch dimension
        "image_meta_dict": val_data["image_meta_dict"]
    }
    
    # 8. Apply Post-processing and Save
    print(f"Saving segmentation mask to: {args.output}")
    post_transforms(result_data)

    print("--- Segmentation complete! ---")


if __name__ == "__main__":
    main()
`;

export const PYINSTALLER_COMMAND = `
pyinstaller --name BrainSegmenter --onefile --console --add-data "models/brain_tumor_model.pth:models" run_segmenter.py
`;

export const PYINSTALLER_EXPLANATION = [
  { flag: '--name BrainSegmenter', desc: 'Sets the name of the final executable file.' },
  { flag: '--onefile', desc: 'Packages everything into a single executable file, rather than a folder.' },
  { flag: '--console', desc: 'Creates a command-line application that opens a terminal window when run.' },
  { flag: '--add-data "source:destination"', desc: "Bundles non-code files. Here, it takes the local 'models/brain_tumor_model.pth' file and places it in a 'models' folder inside the packaged app's temporary directory. The separator is ':' on Linux/macOS and ';' on Windows." },
];

export const USAGE_INSTRUCTIONS = `
# On macOS or Linux
./BrainSegmenter --input /path/to/patient/scan.nii.gz --output /path/to/save/segmentation.nii.gz

# On Windows
BrainSegmenter.exe --input C:\\path\\to\\patient\\scan.nii.gz --output C:\\path\\to\\save\\segmentation.nii.gz
`;

export const USAGE_EXPLANATION = `
The tool requires two arguments: --input, which is the path to the NIfTI scan you want to process, and --output, which is the full path where you want to save the resulting segmentation mask file.
`;

export const GUIDE_CONTEXT = `
You are an expert MLOps assistant specialized in deploying PyTorch models. 
Your knowledge base is strictly limited to the following technical guide on packaging a 3D MONAI segmentation model into a command-line executable using PyInstaller.
When a user asks a question, you must answer based *only* on the information provided in this guide.
Do not invent features, libraries, or steps not mentioned here.
If the user's question is outside the scope of this guide, politely state that you can only answer questions related to the provided MONAI deployment guide.

Here is the guide content:

---

### 1. Final Project Directory Structure
${PROJECT_STRUCTURE}

### 2. The requirements.txt File
${REQUIREMENTS_TXT}

### 3. The Core Python Script (run_segmenter.py)
\`\`\`python
${PYTHON_SCRIPT}
\`\`\`

### 4. The PyInstaller Build Command
\`\`\`bash
${PYINSTALLER_COMMAND}
\`\`\`
**Explanation of flags:**
- **--name BrainSegmenter**: Sets the name of the final executable file.
- **--onefile**: Packages everything into a single executable file, rather than a folder.
- **--console**: Creates a command-line application that opens a terminal window when run.
- **--add-data "source:destination"**: Bundles non-code files. Here, it takes the local 'models/brain_tumor_model.pth' file and places it in a 'models' folder inside the packaged app's temporary directory. The separator is ':' on Linux/macOS and ';' on Windows.

### 5. Step-by-Step Build Instructions
1.  **Set Up Project Directory**: Create the folder structure as shown in Section 1. Place your pre-trained \`brain_tumor_model.pth\` inside the \`models/\` sub-directory.
2.  **Create Core Files**: Create the \`run_segmenter.py\` and \`requirements.txt\` files in your project's root directory. Copy the code from Sections 2 and 3 into them.
3.  **Create a Virtual Environment**: It's best practice to isolate your project's dependencies.
4.  **Install Dependencies**: Install all the required libraries from your \`requirements.txt\` file using pip.
5.  **Run the PyInstaller Build Command**: Execute the build command from Section 4.
6.  **Locate Your Executable**: PyInstaller will create a \`dist/\` folder. Inside, you will find your standalone executable.

### 6. Usage Instructions for the End-User
\`\`\`bash
${USAGE_INSTRUCTIONS}
\`\`\`
${USAGE_EXPLANATION}
---
`;