import os

folder_path = 'augmented_dataset'
files = sorted(os.listdir(folder_path))

for i, filename in enumerate(files):
        file_path = os.path.join(folder_path, filename)
        if os.path.isfile(file_path):
            os.remove(file_path)
