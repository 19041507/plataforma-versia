"""Pacote vazio cujo build_py executa build_files.sh do backend Django."""
from __future__ import annotations

import os
import subprocess
import sys

from setuptools import setup
from setuptools.command.build_py import build_py

BACKEND_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def _run_backend_build() -> None:
    script = os.path.join(BACKEND_ROOT, "build_files.sh")
    if not os.path.isfile(script):
        print("build_files.sh não encontrado — ignorando.", flush=True)
        return

    print("▶ [versia-vercel-build] Executando build_files.sh...", flush=True)
    env = {**os.environ, "PYTHONPATH": BACKEND_ROOT}
    completed = subprocess.run(
        ["bash", script],
        cwd=BACKEND_ROOT,
        env=env,
        check=False,
    )
    if completed.returncode != 0:
        sys.exit(completed.returncode)


class BuildPyRunBackendBuild(build_py):
    def run(self) -> None:
        _run_backend_build()
        super().run()


setup(
    name="versia-vercel-build",
    version="0.0.0",
    py_modules=[],
    cmdclass={"build_py": BuildPyRunBackendBuild},
)
