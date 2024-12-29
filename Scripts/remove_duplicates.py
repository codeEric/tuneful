import os
import re
from rapidfuzz import fuzz

genre_base_dir = "GENRE_PATH"


def normalize_filename(name):
  return re.sub(r"(_\d+|-?\d+|V\d+)$", "", name.lower()).strip()


for genre_folder in os.listdir(genre_base_dir):
  genre_folder_path = os.path.join(genre_base_dir, genre_folder)
  if not os.path.isdir(genre_folder_path):
    continue

  files = []

  for file_name in os.listdir(genre_folder_path):
    if file_name.endswith(".mid"):
      files.append(file_name)

  processed_files = set()

  for i, file_name in enumerate(files):
    file_path = os.path.join(genre_folder_path, file_name)

    if file_name in processed_files:
      continue

    duplicate_group = [file_name]
    processed_files.add(file_name)

    for j in range(i + 1, len(files)):
      other_file_name = files[j]
      other_file_path = os.path.join(genre_folder_path, other_file_name)

      score = fuzz.ratio(normalize_filename(file_name),
                         normalize_filename(other_file_name))

      if score > 60:
        duplicate_group.append(other_file_name)
        processed_files.add(other_file_name)

    if len(duplicate_group) > 1:
      base_file = duplicate_group[0]
      base_file_path = os.path.join(genre_folder_path, base_file)
      base_file_name = normalize_filename(base_file)

      if not base_file_name.endswith(".mid"):
        base_file_name += ".mid"

      base_file_new_path = os.path.join(genre_folder_path, base_file_name)

      if base_file_path != base_file_new_path:
        try:
          os.rename(base_file_path, base_file_new_path)
        except Exception as e:
          print(f"Error has occurred: {e}")

      for duplicate_file in duplicate_group[1:]:
        duplicate_file_path = os.path.join(genre_folder_path, duplicate_file)
        try:
          os.remove(duplicate_file_path)
          print(f"Deleted - {duplicate_file}")
        except Exception as e:
          print(f"Error has occurred: {e}")
    else:
      print(f"No duplicates.")
