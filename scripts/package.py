#!/usr/bin/env python3
"""Build a deterministic, architecture-independent KimiSupporter package."""

import hashlib
import json
from pathlib import Path
import stat
import zipfile

ROOT = Path(__file__).resolve().parents[1]
FILES = ("manifest.json", "index.js", "provider-support.json", "LICENSE", "README.md")
PACKAGE_DATE = (2026, 11, 19, 0, 0, 0)


def main():
    files = {}
    for name in FILES:
        path = ROOT / name
        if path.is_symlink() or not path.is_file():
            raise SystemExit(f"Missing or invalid package input: {name}")
        files[name] = path.read_bytes()

    manifest = json.loads(files["manifest.json"])
    name = f"aide-pkg-{manifest['id']}-v{manifest['version']}.zip"
    output = ROOT / "dist" / name
    output.parent.mkdir(exist_ok=True)

    # Stored entries avoid differences between compressors across platforms.
    with zipfile.ZipFile(output, "w", compression=zipfile.ZIP_STORED) as archive:
        for name, content in files.items():
            entry = zipfile.ZipInfo(name, date_time=PACKAGE_DATE)
            entry.create_system = 3
            entry.external_attr = (stat.S_IFREG | 0o644) << 16
            archive.writestr(entry, content)

    with zipfile.ZipFile(output) as archive:
        if archive.namelist() != list(FILES) or archive.testzip() is not None:
            raise SystemExit("Invalid packaged file list or checksum")
        if any(archive.read(name) != content for name, content in files.items()):
            raise SystemExit("Package content differs from the verified source")

    digest = hashlib.sha256(output.read_bytes()).hexdigest()
    (output.parent / "SHA256SUMS").write_bytes(f"{digest}  {output.name}\n".encode("ascii"))
    print(json.dumps({"path": str(output), "bytes": output.stat().st_size, "sha256": digest}))


if __name__ == "__main__":
    main()
