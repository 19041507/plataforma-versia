"""Entrada serverless na Vercel (sem API legacy `builds` + wsgi path)."""
from config.wsgi import app

__all__ = ["app"]
