import os
import json
import hashlib
import re


def compute_md5(file_path):
  hash_md5 = hashlib.md5()
  with open(file_path, "rb") as f:
    for chunk in iter(lambda: f.read(4096), b""):
      hash_md5.update(chunk)
  return hash_md5.hexdigest()


def sanitize_filename(filename):
  invalid_chars = r'[<>:"/\\|?*]'
  sanitized = re.sub(invalid_chars, "", filename)
  sanitized = sanitized.strip()
  if sanitized in {"CON", "PRN", "AUX", "NUL"} or re.match(r"COM[1-9]|LPT[1-9]", sanitized):
    sanitized = f"{sanitized}_safe"
  return sanitized


def get_unique_name(directory, base_name):
  name, ext = os.path.splitext(base_name)
  counter = 1
  new_name = base_name
  while os.path.exists(os.path.join(directory, new_name)):
    new_name = f"{name}-{counter}{ext}"
    counter += 1
  return new_name


def main(input_dir, json_file):
  with open(json_file, "r") as file:
    md5_to_files = json.load(file)

  for letter_folder in os.listdir(input_dir):
    letter_folder_path = os.path.join(input_dir, letter_folder)
    if not os.path.isdir(letter_folder_path):
      continue

    for file_name in os.listdir(letter_folder_path):
      if not file_name.endswith(".mid"):
        continue

      file_path = os.path.join(letter_folder_path, file_name)
      md5_hash = compute_md5(file_path)

      if md5_hash in md5_to_files:
        preferred_name = os.path.basename(md5_to_files[md5_hash][0])
        sanitized_name = sanitize_filename(preferred_name)

        unique_name = get_unique_name(letter_folder_path, sanitized_name)
        new_file_path = os.path.join(letter_folder_path, unique_name)
        os.rename(file_path, new_file_path)
      else:
        print(f"MD5 not found - {file_path}")


if __name__ == "__main__":
  input_dir = "INPUT_DIR"
  json_file = "JSON_DIR"
  main(input_dir, json_file)
