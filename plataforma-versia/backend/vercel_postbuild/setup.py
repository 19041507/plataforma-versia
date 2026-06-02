"""Dispara build_files.sh do backend durante o build deste pacote (PEP 517)."""
from __future__ import annotations

import os
import subprocess
import sys

from setuptools import setup
from setuptools.command.build_py import build_py

BACKEND_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def _run() -> None:
    script = os.path.join(BACKEND_ROOT, "build_files.sh")
    print("▶ [versia-vercel-build] Executando build_files.sh...", flush=True)
    completed = subprocess.run(
        ["bash", script],
        cwd=BACKEND_ROOT,
        env={**os.environ, "PYTHONPATH": BACKEND_ROOT},
        check=False,
    )
    if completed.returncode != 0:
        sys.exit(completed.returncode)


class BuildPy(build_py):
    def run(self) -> None:
        _run()
        super().run()


setup(
    name="versia-vercel-build",
    version="0.0.0",
    py_modules=["stub"],
    cmdclass={"build_py": BuildPy},
)
