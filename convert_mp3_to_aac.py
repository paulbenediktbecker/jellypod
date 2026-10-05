
import os
import subprocess

from pathlib import Path

def convert_mp3_to_aac(input_dir, output_dir):
    input_dir = Path(input_dir).resolve()
    output_dir = Path(output_dir).resolve()

    for mp3_path in input_dir.rglob("*.mp3"):
        relative_path = mp3_path.relative_to(input_dir)
        output_file = output_dir / relative_path.with_suffix(".m4a")

        output_file.parent.mkdir(parents=True, exist_ok=True)


        cmd = [
            "ffmpeg",
            "-i", str(mp3_path),
            "-vn",  # no video (strip album art)
            "-ar", "44100",  # sample rate
            "-ac", "2",      # stereo
            "-c:a", "aac",
            "-profile:a", "aac_low",
            "-b:a", "128k",
            "-movflags", "+faststart",
            "-y",
            str(output_file)
        ]

        print(f"Converting: {mp3_path} -> {output_file}")
        subprocess.run(cmd, check=True)
        input("weiter")

    print("All conversions completed.")

# Example usage:
convert_mp3_to_aac("/Users/becker/git/spotipod/music", "/Users/becker/git/jellypod/data")
