import os
import shutil
import csv
from rapidfuzz import process, fuzz

matched_dir = "MATCHED_DIR_PATH"
output_base_dir = "OUTPUT_DIR_PATH"
csv_file_path = "CSV_PATH"

song_genre_map = {}
with open(csv_file_path, mode="r", encoding="utf-8") as csv_file:
  csv_reader = csv.reader(csv_file, delimiter=",")  # Use comma delimiter
  for row in csv_reader:
    print(row)
    artist_song, genre = row
    song_genre_map[artist_song.strip()] = genre.strip()


def normalize_name(name):
  return os.path.splitext(name)[0].lower().replace("_", " ").replace("-", " ").strip()


def get_unique_filename(destination_path):
  base, extension = os.path.splitext(destination_path)
  counter = 1
  new_path = destination_path
  while os.path.exists(new_path):
    new_path = f"{base}_{counter}{extension}"
    counter += 1
  return new_path


os.makedirs(output_base_dir, exist_ok=True)

for letter_folder in os.listdir(matched_dir):
  letter_folder_path = os.path.join(matched_dir, letter_folder)
  if not os.path.isdir(letter_folder_path):
    continue

  for file_name in os.listdir(letter_folder_path):
    if not file_name.endswith(".mid"):
      continue

    normalized_file_name = normalize_name(file_name)

    result = process.extractOne(
        normalized_file_name,
        song_genre_map.keys(),
        scorer=fuzz.partial_ratio,
    )

    if result:
      match, score = result[:2]
      if score > 50:
        genre = song_genre_map[match]
        genre_folder = os.path.join(output_base_dir, genre)
        os.makedirs(genre_folder, exist_ok=True)

        source_path = os.path.join(letter_folder_path, file_name)
        destination_path = os.path.join(genre_folder, file_name)

        destination_path = get_unique_filename(destination_path)

        try:
          shutil.move(source_path, destination_path)
          print(f"Moved: {file_name} to {genre}/{destination_path}")
        except PermissionError:
          print(f"Permission error: {file_name}")
        except Exception as e:
          print(f"Error has occurred: {e}")
      else:
        print(f"No confident match")
    else:
      print(f"No match found")
