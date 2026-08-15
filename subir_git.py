import subprocess
import sys


def ejecutar(args: list[str]) -> None:
    """Ejecuta un comando y conserva su código de error al terminar el script.

    Args:
        args: Programa y argumentos, separados para evitar invocar un shell.
    """
    print(f"$ {' '.join(args)}")
    resultado = subprocess.run(args)
    if resultado.returncode != 0:
        sys.exit(resultado.returncode)


def subir_cambios() -> None:
    """Añade los cambios, crea un commit genérico y lo envía al remoto actual."""
    ejecutar(["git", "status"])
    ejecutar(["git", "add", "."])
    resultado = subprocess.run(["git", "diff", "--cached", "--quiet"])
    if resultado.returncode == 0:
        print("No hay cambios para subir.")
        return
    ejecutar(["git", "commit", "-m", "update"])
    ejecutar(["git", "push"])


if __name__ == "__main__":
    subir_cambios()
