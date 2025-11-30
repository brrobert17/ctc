### Setup python environment

python -m venv venv

.\venv\Scripts\Activate

pip install -r requirements.txt


### Run

.\venv\Scripts\Activate

uvicorn app:app --host 0.0.0.0 --port 8000