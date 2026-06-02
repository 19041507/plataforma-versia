"""Hook de instalação para rodar build_files.sh no deploy Vercel (@vercel/python)."""
from __future__ import annotations

import os
import subprocess
import sys

from setuptools import setup
from setuptools.command.develop import develop
from setuptools.command.install import install

HERE = os.path.dirname(os.path.abspath(__file__))


def _run_vercel_build() -> None:
    script = os.path.join(HERE, "build_files.sh")
    if not os.path.isfile(script):
        print("build_files.sh não encontrado — ignorando.", flush=True)
        return

    print("▶ Executando build_files.sh (collectstatic / migrações)...", flush=True)
    env = {**os.environ, "PYTHONPATH": HERE}
    completed = subprocess.run(
        ["bash", script],
        cwd=HERE,
        env=env,
        check=False,
    )
    if completed.returncode != 0:
        sys.exit(completed.returncode)


class InstallWithVercelBuild(install):
    def run(self) -> None:
        install.run(self)
        _run_vercel_build()


class DevelopWithVercelBuild(develop):
    def run(self) -> None:
        develop.run(self)
        _run_vercel_build()


setup(
    name="versia-backend",
    version="0.0.1",
    description="Hook de build para deploy Django na Vercel",
    py_modules=[],
    cmdclass={
        "install": InstallWithVercelBuild,
        "develop": DevelopWithVercelBuild,
    },
)
