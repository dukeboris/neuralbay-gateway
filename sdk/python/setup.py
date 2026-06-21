from setuptools import setup, find_packages

setup(
    name="neuralbay",
    version="0.1.0",
    packages=find_packages(),
    install_requires=["httpx>=0.27"],
    python_requires=">=3.9",
    description="NeuralBay AI Gateway Python SDK",
    author="NeuralBay",
)
