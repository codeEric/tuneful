import hashlib
import os
from note_seq import midi_io
import tensorflow.compat.v1 as tf


def generate_note_sequence_id(filename, collection_name, source_type):
  filename_fingerprint = hashlib.sha1(filename.encode('utf-8'))
  return '/id/%s/%s/%s' % (
      source_type.lower(), collection_name, filename_fingerprint.hexdigest())


def convert_files(root_dir, sub_dir, writer):
  dir_to_convert = os.path.join(root_dir, sub_dir)
  files_in_dir = tf.gfile.ListDirectory(os.path.join(dir_to_convert))
  recurse_sub_dirs = []
  for file_in_dir in files_in_dir:
    full_file_path = os.path.join(dir_to_convert, file_in_dir)
    if full_file_path.endswith('.mid'):
      try:
        sequence = convert_midi(root_dir, sub_dir, full_file_path)
      except Exception:
        continue
      if sequence:
        writer.write(sequence.SerializeToString())
    else:
      if tf.gfile.IsDirectory(full_file_path):
        recurse_sub_dirs.append(os.path.join(sub_dir, file_in_dir))

  for recurse_sub_dir in recurse_sub_dirs:
    convert_files(root_dir, recurse_sub_dir, writer)


def convert_midi(root_dir, sub_dir, full_file_path):
  try:
    sequence = midi_io.midi_to_sequence_proto(
        tf.gfile.GFile(full_file_path, 'rb').read())
  except midi_io.MIDIConversionError:
    return None
  sequence.collection_name = os.path.basename(root_dir)
  sequence.filename = os.path.join(sub_dir, os.path.basename(full_file_path))
  sequence.id = generate_note_sequence_id(
      sequence.filename, sequence.collection_name, 'midi')
  return sequence


def main(argv):
  input_dir = "INPUT_DIR"
  output = "OUTPUT_DIR"

  with tf.io.TFRecordWriter(output) as writer:
    convert_files(input_dir, '', writer)


if __name__ == '__main__':
  tf.disable_v2_behavior()
  tf.app.run(main)
